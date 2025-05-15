export const paramList = {
  swap_fee: {
    shortName: "Swap fee",
    description: "Swapping fee, percentage of traded amount.",
    validator: (value) => value < 1 && value >= 0,
    rule: "The value of the swap_fee parameter must be positive and less than 100.",
    isPercentage: true,
    initValue: 0.003
  },
  exit_fee: {
    shortName: "Exit fee",
    description: "Fee charged when removing liquidity from the pool.",
    validator: (value) => value < 1 && value >= 0,
    rule: "The value of the exit_fee parameter must be positive and less than 100.",
    isPercentage: true,
    initValue: 0.005
  },
  arb_profit_tax: {
    shortName: "Arbitrageur profit tax",
    description: "Additional fee that is charged as a percentage of arbitrageur profit. It is assumed that arbitrageurs buy from the pool in order to sell elsewhere and make a profit from the difference in prices.",
    validator: (value) => value >= 0,
    rule: "The value of the arb_profit_tax parameter must be greater than or equal to 0.",
    isPercentage: true,
    initValue: 0
  },
  leverage_profit_tax: {
    shortName: "Leverage profit tax",
    description: "Percentage of profit charged from a leveraged position when it is closed (if the close price is higher than the open price).",
    validator: (value) => value < 1 && value >= 0,
    rule: "The value of the leverage_profit_tax parameter must be positive and less than 100.",
    isPercentage: true,
    initValue: 0
  },
  leverage_token_tax: {
    shortName: "Leverage token tax",
    description: "Percentage of the redeemed amount charged when redeeming a leveraged token.",
    validator: (value) => value < 1 && value >= 0,
    rule: "The value of the leverage_token_tax parameter must be positive and less than 100.",
    isPercentage: true,
    initValue: 0
  },
  mid_price: {
    shortName: "Mid-price",
    description: "Medium price for stablecoin pairs.",
    validator: (value) => Number(value) > 0,
    rule: "The value of the mid_price parameter must be greater than 0.",
    initValue: 0
  },
  price_deviation: {
    shortName: "Price deviation",
    description: "Deviation from the mid-price. Stablecoin pairs trade within a limited range determined by the price deviation.",
    validator: (value) => Number(value) > 1,
    rule: "The value of the price_deviation parameter must be greater than 1.",
    initValue: 0
  },
  base_interest_rate: {
    shortName: "Base interest rate",
    description: "Base interest rate charged from leveraged positions. If there are many leveraged positions, the rate can increase depending on utilization.",
    validator: (value) => value >= 0,
    rule: "The value of the base_interest_rate parameter must be greater than or equal 0",
    isPercentage: true,
    initValue: 0.2
  },
  pool_leverage: {
    shortName: "Pool leverage",
    description: "A multiplier that makes the pool behave like it has more liquidity than it really has. The full multiplier is applied when the pool is balanced and it decreases as the pool goes out of balance.",
    validator: (value, _, governanceState, poolDefParams) => {

      if (value < 1) return false;

      const mid_price = ("mid_price" in governanceState) ? governanceState.mid_price : (("mid_price" in poolDefParams) ? poolDefParams.mid_price : paramList.mid_price.initValue);

      if (mid_price !== 0) return false;

      const alpha = ("alpha" in governanceState) ? governanceState.alpha : (("alpha" in poolDefParams) ? poolDefParams.alpha : paramList.alpha.initValue);

      if (!((alpha !== 1 / value) && (1 - alpha !== 1 / value))) return false;

      return true;

    },
    rule: "The value of the pool_leverage parameter must be greater than or equal to 1. Can't be equal to 1 / (Pool weight) or 1 / (1 - (Pool weight)).",
    initValue: 1
  },
  alpha: {
    shortName: "Pool weights",
    description: "Relative weights of the two tokens in the pool.",
    validator: (value, _, governanceState, poolDefParams) => {
      const lambda = ("pool_leverage" in governanceState) ? governanceState.pool_leverage : (("pool_leverage" in poolDefParams) ? poolDefParams.pool_leverage : paramList.pool_leverage.initValue);

      return value > 0 && value < 1 && (value !== 1 / lambda) && ((1 - value) !== 1 / lambda)
    },
    rule: "The value of the alpha parameter must be positive and less than 100. Pool leverage can't be equal to 1 / (Pool weight) or 1 / (1 - (Pool weight)).",
    initValue: 0.5,
    isPercentage: true
  },
  period_length: {
    shortName: "Period length for tracking min/max prices",
    description: "Period (in seconds) during which minimum and maximum prices are tracked. They are used in liquidity adds/removals in order to prevent manipulation.",
    validator: (value) => Number.isInteger(Number(value)) && value >= 0,
    rule: "The value of the period_length parameter must be integer greater than or equal to 0.",
    initValue: 3600
  }
};