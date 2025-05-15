import { Layout } from "antd";

import { AppLogo } from "components/AppLogo/AppLogo";
import { SocialIcons } from "components/SocialIcons/SocialIcons";

import styles from "./PageLayout.module.css";

const { Content, Footer} = Layout;

export const PageLayout = ({ children }) => <div>
  <Content className={styles.container}>
    <div style={{ margin: "0 auto" }}><AppLogo /></div>
    {children}
  </Content>

  <Footer className={styles.footer}>
    <SocialIcons centered />
    <div className={styles.copyWrap}>
      <a href="https://obyte.org" target="_blank" rel="noopener">Built on Obyte</a>
    </div>
  </Footer>
</div>