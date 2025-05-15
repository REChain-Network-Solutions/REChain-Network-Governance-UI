import { Spin, List } from "antd";
import { useEffect, useState } from "react";

import { GovernanceItem } from "components/GovernanceItem/GovernanceItem";
import { paramList } from "paramList";

export const GovernanceList = ({ governance_state, poolDefParams, paramsInfo, activeGovernance, voteTokenDecimals, voteTokenSymbol, voteTokenAddress, freeze_period, challenging_period, activeWallet, balance, mid_price_decimals, x_symbol, y_symbol }) => {
  const [data, setData] = useState([]);
  const [allActualParams, setAllActualParams] = useState(null);

  useEffect(async () => {
    setData([]);
    const allActualParams = {};

    Object.keys(paramsInfo).forEach((name) => {
      allActualParams[name] = (name in governance_state) ? governance_state[name] : ((name in poolDefParams) ? poolDefParams[name] : paramList[name].initValue);
    })

    setAllActualParams(allActualParams);

    const data = Object.keys(paramsInfo).map((name) => ({
      name,
      ...paramsInfo[name],
      choice: paramsInfo[name]?.choices?.[activeWallet],
      value: allActualParams[name]
    }))


    const filetedData = data.filter(({ value, name }) => {
      if ((name === "mid_price" || name === "price_deviation") && (!value || Number(value) === 0)) return false;
      if (name === "pool_leverage") {
        const mid_price = data.find(({ name }) => name === "mid_price").value
        if (Number(mid_price) !== 0) return false
      }
      return true
    });

    setData(filetedData);
  }, [paramsInfo, balance, activeWallet, governance_state]);

  if (data.length === 0 || allActualParams === null) return <div style={{ padding: 30, display: "flex", justifyContent: "center", width: "100%" }}>
    <Spin size="large" />
  </div>

  return <List
    dataSource={data}
    renderItem={params => {
      return <GovernanceItem
        voteTokenDecimals={voteTokenDecimals}
        voteTokenSymbol={voteTokenSymbol}
        voteTokenAddress={voteTokenAddress}
        activeGovernance={activeGovernance}
        allActualParams={allActualParams}
        freeze_period={freeze_period}
        mid_price_decimals={mid_price_decimals}
        x_symbol={x_symbol}
        y_symbol={y_symbol}
        challenging_period={challenging_period}
        governance_state={governance_state}
        balance={balance}
        activeWallet={activeWallet}
        poolDefParams={poolDefParams}
        {...params}
      />
    }}
    rowKey={(item) => item.name + item.value}
  />
}