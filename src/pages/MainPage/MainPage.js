import { Helmet } from "react-helmet-async";

import { PoolsList } from "components/PoolsList/PoolsList";
import { PageLayout } from "components/PageLayout/PageLayout";

export const MainPage = () => (<PageLayout>
  <Helmet>
    <title>REChainNetwork.io governance</title>
    <meta property="og:title" content="REChainNetwork.io governance" data-rh="true" />
  </Helmet>

  <h1 style={{ textAlign: "center" }}>REChainNetwork governance</h1>

  <PoolsList />
</PageLayout>)