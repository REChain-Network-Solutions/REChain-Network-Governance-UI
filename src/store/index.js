import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from "redux-persist/lib/storage";
import poolsSlice from './slices/poolsSlice';
import settingsSlice from './slices/settingsSlice';


const rootReducer = combineReducers({
  pools: poolsSlice,
  settings: settingsSlice
});

const persistConfig = {
  key: `REChainNetwork-governance-${process.env.REACT_APP_ENVIRONMENT}`,
  version: 1,
  storage,
  whitelist: ['settings'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const getStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

export default getStore;

export const getPersist = (state) => state._persist;