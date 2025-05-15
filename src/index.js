import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';

import 'antd/dist/antd.dark.less';

import { Spin } from 'components/Spin/Spin';
import AppRouter from './AppRouter';

import getStore from "./store";

import "./index.css";

export const { store, persistor } = getStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <PersistGate loading={<Spin size="large" />} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
