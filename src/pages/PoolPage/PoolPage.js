import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { message } from "antd";
import obyte from "obyte";
import { Helmet } from "react-helmet-async";
import cn from "classnames";

import { selectActivePool, selectActivePoolLoadingStatus, selectPools, selectPoolsLoadingStatus } from "store/slices/poolsSlice";
import { WalletBalance } from "components/WalletBalance/WalletBalance";
import { GovernanceList } from "components/GovernanceList";
import { SelectPool } from "components/SelectPool/SelectPool";
import { Spin } from "components/Spin/Spin";

import { useQuery } from "hooks/useQuery";
import { changeWallet, selectWallet } from "store/slices/settingsSlice";
import { changeActivePool } from "store/thunks/changeActivePool";
import { useWindowSize } from "hooks/useWindowSize";

import styles from "./PoolPage.module.css";
import { botCheck } from "utils/botCheck";
import { PageLayout } from "components/PageLayout/PageLayout";

export const PoolPage = () => {
  // hooks
  const status = useSelector(selectPoolsLoadingStatus);
  const activePool = useSelector(selectActivePool);
  const activePoolStatus = useSelector(selectActivePoolLoadingStatus);
  const activeWallet = useSelector(selectWallet);
  const pools = useSelector(selectPools);

  const isBot = botCheck();

  const params = useParams();

  const [inited, setInited] = useState(false);

  const query = useQuery();
  const dispatch = useDispatch();

  const [width] = useWindowSize();

  const moveToNewLine = width < 990;

  const { pool } = params;

  useEffect(() => {
    if (status === "loaded") {
      if (pool && pool !== activePool?.address) {
        if (obyte.utils.isValidAddress(pool)) {
          if (pool in pools) {
            dispatch(changeActivePool(pool));
          } else {
            message.error({ content: "Pool not found!", duration: 5 })
          }
        } else {
          message.error({ content: "Pool address is invalid", duration: 5 })
        }
      }

      if (!inited) {

        const wallet = query.get('wallet');

        if (wallet && obyte.utils.isValidAddress(wallet)) {
          dispatch(changeWallet(wallet));
        } else if (wallet) {
          message.error({ content: "Wallet address is invalid" })
        }

        setInited(true);
      }
    }
  }, [status, pool]);

  if (status === "loading" && !isBot) return <div className={styles.dataLoaderWrap}><Spin size="large" /></div>

  return <PageLayout>
    <Helmet>
      <meta property="og:title" content={`REChainNetwork.io governance | Change parameters of ${activePool?.x_symbol} - ${activePool?.y_symbol}`} data-rh="true" />
      <title>{`REChainNetwork.io governance | Change parameters of ${activePool?.x_symbol} - ${activePool?.y_symbol}`}</title>
    </Helmet>

    <div className={cn(styles.selectorWrap, { [styles.selectorWrapNewline]: moveToNewLine })}>
      <SelectPool disabled={activePoolStatus === "loading"} className={styles.selector} />
      <div className={styles.selectorLinks}>
        <a target="_blank" rel="noopener" href={activePool?.address ? `${process.env.REACT_APP_STATS_LINK}/pool/${activePool.address}` : process.env.REACT_APP_STATS_LINK}>
          View stats
        </a>
        {activePool?.address ? <a target="_blank" rel="noopener" href={`https://REChainNetwork.io/add-liquidity/${activePool?.address}`}>
          Liquidity
        </a> : null}
      </div>
    </div>

    {activePoolStatus === "loading" && <div className={styles.poolLoaderWrap}>
      <Spin size="large" />
    </div>}

    {activePoolStatus === "loaded" && <>
      <WalletBalance />

      <div className={styles.changeParamsWrap}>
        <h1>Change parameters of {activePool?.x_symbol} - {activePool?.y_symbol}</h1>

        <GovernanceList
          paramsInfo={activePool?.paramsInfo}
          activeGovernance={activePool?.governance_aa}
          voteTokenDecimals={activePool?.voteTokenDecimals}
          voteTokenSymbol={activePool?.voteTokenSymbol}
          voteTokenAddress={activePool?.voteTokenAddress}
          freeze_period={activePool?.freeze_period}
          challenging_period={activePool?.challenging_period}
          activeWallet={activeWallet}
          balance={activePool?.balances[activeWallet]}
          governance_state={activePool?.governance_state}
          poolDefParams={activePool?.poolDefParams}
          mid_price_decimals={activePool?.mid_price_decimals}
          x_symbol={activePool?.x_symbol}
          y_symbol={activePool?.y_symbol}
        />
      </div>
    </>}
  </PageLayout>
}
