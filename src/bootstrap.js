import { isEmpty } from "lodash";

import { store } from "index";
import client from "services/obyte";
import { loadPools } from "store/thunks/loadPools";
import { changeActivePool } from "store/thunks/changeActivePool";
import { changeState } from "store/slices/poolsSlice";
import { botCheck } from "utils/botCheck";

export const bootstrap = async () => {
  console.log("connect");
  const state = store.getState();

  const isBot = botCheck();

  if (!isBot) {
    const heartbeat = setInterval(function () {
      client.api.heartbeat();
    }, 10 * 1000);

    client.subscribe((err, result) => {
      if (err) return null;

      const { subject, body } = result[1];
      const { aa_address, updatedStateVars } = body;

      if (subject === "light/aa_response") {
        let diff = {};

        if (updatedStateVars) {
          for (let var_name in updatedStateVars[aa_address]) {
            diff[var_name] = updatedStateVars[aa_address][var_name].value;
          }
        }

        if (!isEmpty(diff)) {
          store.dispatch(changeState({ diff, address: aa_address }));
        }

      }
    });

    client.client.ws.addEventListener("close", () => {
      clearInterval(heartbeat);
    });  
  }


  if (state.pools.active && state.pools.active.address) {
    store.dispatch(changeActivePool(state.pools.active.address));
  }

  store.dispatch(loadPools());
}