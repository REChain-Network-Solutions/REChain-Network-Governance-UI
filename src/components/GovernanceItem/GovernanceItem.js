import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip, Statistic } from "antd";
import { isEqual, isNumber } from "lodash";
import { useState, useEffect } from "react";
import QRButton from "obyte-qr-button";

import { useWindowSize } from "hooks/useWindowSize";
import { SupportListModal } from "modals/SupportListModal";
import { ChangeParamsModal } from "modals/ChangeParamsModal";
import { generateLink } from "utils/generateLink";

import { paramList } from "paramList";

import styles from "./GovernanceItem.module.css";

const linkStyles = { padding: 0 };
const { Countdown } = Statistic;

const viewParam = ({ value, name, mid_price_decimals }) => {
  if (name === "alpha") {
    const inPercent = +Number(value * 100).toFixed(4);
    return `${inPercent}% / ${100 - inPercent}%`;
  } if (name === "mid_price" && mid_price_decimals !== undefined){
    return +Number(value / 10 ** mid_price_decimals).toPrecision(6);
  } else if (paramList[name]?.isPercentage) {
    return +Number(value * 100).toFixed(4) + " %";
  } else {
    return value
  }
}

/* eslint-disable eqeqeq */

export const GovernanceItem = (props) => {
  const { name, value, activeGovernance, choice, leader, voteTokenDecimals, voteTokenSymbol, challenging_period, freeze_period, supports = {}, challenging_period_start_ts, change, balance, activeWallet, mid_price_decimals } = props;

  const description = paramList[name]?.description || "No description";
  const rule = paramList[name]?.rule || "No rule";

  const valueView = viewParam({ name, value, mid_price_decimals });
  const choiceView = viewParam({ name, value: choice, mid_price_decimals });
  const leaderView = viewParam({ name, value: leader, mid_price_decimals });

  const [width] = useWindowSize();


  const shortName = paramList[name]?.shortName;

  const [isFrozen, setIsFrozen] = useState(challenging_period_start_ts && ((challenging_period_start_ts + challenging_period + freeze_period) * 1000) > Date.now());
  const [expiredChallengingPeriod, setExpiredChallengingPeriod] = useState(((challenging_period_start_ts + challenging_period) * 1000) < Date.now());

  useEffect(() => {
    setExpiredChallengingPeriod(((challenging_period_start_ts + challenging_period) * 1000) < Date.now());
  }, [challenging_period_start_ts, challenging_period, balance, activeGovernance])

  useEffect(() => {
    let intervalId;
    setIsFrozen(((challenging_period_start_ts + challenging_period + freeze_period) * 1000) > Date.now());
    if (challenging_period_start_ts && isFrozen === true) {
      intervalId = setInterval(() => {
        if (((challenging_period_start_ts + challenging_period + freeze_period) * 1000) < Date.now()) {
          setIsFrozen(false);
          clearInterval(intervalId);
        }
      }, 10 * 1000)
    }
    return () => intervalId !== undefined && clearInterval(intervalId);
  }, [choice, isFrozen, challenging_period_start_ts, challenging_period])

  const supportsByValue = Object.keys(supports).map((value) => ({
    value, supports: supports[value].reduce(function (sum, current) {
      return sum + current.support;
    }, 0)
  }));

  const commitLink = generateLink({
    amount: 1e4,
    data: {
      name, commit: 1
    },
    aa: activeGovernance,
    is_single: true,
    from_address: activeWallet
  });

  const linkRemoveSupport = generateLink({
    amount: 1e4,
    data: {
      name
    },
    aa: activeGovernance,
    is_single: true,
    from_address: activeWallet
  });

  return <div className={styles.item} key={name + value}>
    <div className={styles.header}>
      <div className={styles.paramName}>
        {shortName}
        <Tooltip title={description}>
          <InfoCircleOutlined style={{ marginLeft: 10 }} />
        </Tooltip>
      </div>
      <div className={styles.headerValue}><span className={styles.label}>Current value</span>: <span>{valueView}</span></div>
    </div>
    {leader !== undefined && (!isEqual(leader, value)) && <div className={styles.leaderWrap}>
      <div className={styles.leaderValue}>
        <b>Leader:</b> <span>{leaderView}</span>
      </div>
      <div>
        {expiredChallengingPeriod ?
          <QRButton type="link" disabled={!activeWallet || isEqual(leaderView, valueView) || value == leader} style={linkStyles} href={commitLink}>
            commit
          </QRButton> : (challenging_period_start_ts && <>Challenging period expires in <Countdown style={{ display: "inline" }} onFinish={() => setExpiredChallengingPeriod(true)} valueStyle={{ fontSize: 14, display: "inline", wordBreak: "break-all" }} value={(challenging_period_start_ts + challenging_period) * 1000} format={challenging_period > 86400 ? "D [days] HH:mm:ss" : "HH:mm:ss"} /></>)}
      </div>
    </div>}
    {choice !== undefined && <div className={styles.choiceWrap}>
      <div className={styles.choiceValue}>
        <b>My choice:</b> <span>{choiceView}</span>
      </div>
      <div>
        <Tooltip title={((isEqual(choice, leader) || choice === leader) && isFrozen) ? "Your choice is the leader and you'll be able to remove your support only after the challenging period and freeze period expire, or if some other value becomes the leader." : null}>
          <QRButton type="link" disabled={((isEqual(choice, leader) || choice === leader) && isFrozen) || !activeWallet} style={linkStyles} href={linkRemoveSupport}>
            remove support
          </QRButton>
        </Tooltip>
      </div>
    </div>}
    {supportsByValue.length > 0 && <div className={styles.listOfVoters}>
      <div className={styles.listOfVotersTitle}>List of voters</div>
      <div className={styles.listOfVotersHeader}>
        <div className={styles.listOfVotersValue}><b>Value</b></div>
        <div className={styles.listOfVotersSupport}><b>Support</b></div>
      </div>
      {supportsByValue.map(({ value, supports: supportedValue }, i) => <div key={i + " " + value} className={styles.listOfVotersItem}>
        <div className={styles.listOfVotersValue}>{width <= 780 && <b>Value: </b>}<span>{viewParam({ name, value })}</span></div>
        <div className={styles.listOfVotersSupport}>{width <= 780 && <b>Support: </b>} <SupportListModal sum={+Number(supportedValue / 10 ** voteTokenDecimals).toFixed(voteTokenDecimals)} decimals={voteTokenDecimals} symbol={voteTokenSymbol} supportList={supports[value]} /> </div>
        <div className={styles.listOfVotersAction}><ChangeParamsModal shortName={shortName} change={change} {...props} disabled={(choice !== undefined && isFrozen && (choice == leader || isEqual(leader, choice))) || !activeWallet} rule={rule} description={description} balance={balance} supportedValue={value} isMyChoice={choice !== undefined && (isNumber(choice) ? Number(choice) === Number(value) : choice === value)} /></div>
      </div>)}
    </div>}
    <div className={styles.listOfVotersAnotherValue}>
      <ChangeParamsModal change={change} shortName={shortName} {...props} rule={rule} description={description} balance={balance} disabled={(choice !== undefined && isFrozen && (choice == leader || isEqual(leader, choice))) || !activeWallet} />
    </div>
  </div>
}
