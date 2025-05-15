import { useSelector } from "react-redux";

import { AddWalletModal } from "modals/AddWalletModal";
import { selectActivePool } from "store/slices/poolsSlice";
import { selectWallet } from "store/slices/settingsSlice";
import { WithdrawGovernanceSupportModal } from "modals/WithdrawGovernanceSupportModal";

import styles from "./WalletBalance.module.css";

export const WalletBalance = () => {
  const walletAddress = useSelector(selectWallet);
  const activePool = useSelector(selectActivePool);

  const balance = activePool?.balances[walletAddress] || 0;
  const symbol = activePool?.voteTokenSymbol;
  const decimals = activePool?.voteTokenDecimals;
  const poolAsset = activePool?.pool_asset;
  const paramsInfo = activePool?.paramsInfo;

  const choiceParams = paramsInfo && walletAddress && Object.keys(paramsInfo).filter((name) => paramsInfo[name]?.choices && (walletAddress in paramsInfo[name]?.choices));

  return <div className={styles.walletWrap}>
    {walletAddress ? <div>
      <div className={styles.active}>Your voting address is <AddWalletModal /> </div>
      <div>Locked balance: {+Number(balance / 10 ** decimals).toFixed(decimals)} {symbol === poolAsset.replace(/[+=]/, '').substr(0, 6) ? <a href={`${process.env.REACT_APP_EXPLORER_LINK}${poolAsset}`} target="_blank" rel="noopener">{symbol}</a> : symbol} {" "}
        <WithdrawGovernanceSupportModal
          voteTokenSymbol={symbol}
          voteTokenDecimals={decimals}
          max={balance}
          activeGovernance={activePool?.governance_aa}
          activeWallet={walletAddress}
          disabled={!walletAddress || choiceParams?.length > 0 || balance === 0 || balance === "0"}
          choiceParams={choiceParams}
        >
          Withdraw
        </WithdrawGovernanceSupportModal>
        </div>
    </div> : <div className={styles.addWalletWrap}>
      <div className={styles.pr_5}>Your balance on the governance autonomous agent is <AddWalletModal>please add your address first</AddWalletModal>.</div>
    </div>}
  </div>
}