import { Link } from "react-router-dom";

import styles from "./AppLogo.module.css";

export const AppLogo = () => <div className={styles.logoWrap}>
  <Link to="/">
    <img src="/logo.svg" className={styles.logo} alt="REChainNetwork" />
  </Link>
</div>