import { MainPage, PoolPage } from "pages";
import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { bootstrap } from "bootstrap";
import { botCheck } from "utils/botCheck";

const AppRouter = () => {

  useEffect(() => {
    const isBot = botCheck();

    if (isBot) {
      bootstrap();
    }
  }, []);

  return <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<MainPage />} />
        <Route path=":pool" element={<PoolPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default AppRouter;