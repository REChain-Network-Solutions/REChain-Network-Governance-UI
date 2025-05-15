import { createSlice } from '@reduxjs/toolkit';

export const MAX_LENGTH_RECENT_LIST = 5;

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    wallet: undefined,
    recentPools: []
  },
  reducers: {
    changeWallet: (state, action) => {
      state.wallet = action.payload;
    },
    addRecentPool: (state, action) => {
      if (!state.recentPools.includes(action.payload)) {
        if (state.recentPools.length >= MAX_LENGTH_RECENT_LIST) {
          state.recentPools.shift();
        }
        
        state.recentPools.push(action.payload);
      }
    },
  }
});

export const { changeWallet, addRecentPool } = settingsSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.auth.value)`

export const selectWallet = state => state.settings.wallet;
export const selectRecentPools = state => state.settings.recentPools;

export default settingsSlice.reducer;