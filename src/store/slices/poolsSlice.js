import { createSlice } from '@reduxjs/toolkit';
import { changeActivePool } from 'store/thunks/changeActivePool';
import { loadPools } from 'store/thunks/loadPools';
import { parseGovernanceStateVars } from 'utils/parseGovernanceStateVars';

export const poolsSlice = createSlice({
  name: 'pools',
  initialState: {
    pools: {},
    status: "loading",
    active: null,
    activeStatus: null
  },
  reducers: {
    changeActivePool: (state, action) => {
      state.active = action.payload;
    },
    changeState: (state, action) => {
      const { diff, address } = action.payload;

      if (state?.active?.governance_aa && state?.active?.governance_aa === address) {
        const newState = { ...state.active.governance_state, ...diff };

        for (const var_name in diff) {
          if (diff[var_name] === undefined || diff[var_name] === false) {
            delete newState[var_name];
          }
        }

        const data = parseGovernanceStateVars(newState);

        state.active.balances = data.balances;
        state.active.paramsInfo = data.paramsInfo;
        state.active.governance_state = newState;
      }
    }
  },
  extraReducers: {
    [loadPools.fulfilled]: (state, action) => {
      state.pools = action.payload;
      state.status = "loaded";
    },
    [loadPools.pending]: (state) => {
      state.status = "loading";
    },
    [changeActivePool.fulfilled]: (state, action) => {
      state.active = action.payload;
      state.activeStatus = "loaded";
    },
    [changeActivePool.pending]: (state) => {
      state.activeStatus = "loading";
    },
  }
});

export const { changeState } = poolsSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.auth.value)`

export const selectPools = state => state.pools.pools;
export const selectActivePool = state => state.pools.active;
export const selectPoolsLoadingStatus = state => state.pools.status;
export const selectActivePoolLoadingStatus = state => state.pools.activeStatus;

export default poolsSlice.reducer;