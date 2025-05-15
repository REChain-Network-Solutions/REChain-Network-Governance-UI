import { Select } from "antd";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { selectActivePool, selectPools } from "store/slices/poolsSlice";
import { MAX_LENGTH_RECENT_LIST, selectRecentPools } from "store/slices/settingsSlice";

import { paramList } from "paramList";
import { useNavigate } from "react-router-dom";

export const SelectPool = ({ styles, disabled, className }) => {
  // hooks
  const pools = useSelector(selectPools);
  const recentPools = useSelector(selectRecentPools);
  const activePool = useSelector(selectActivePool);

  const navigate = useNavigate();

  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);


  // handles
  const handleChangePool = (pool) => {
    navigate(`/${pool}`);
    ref.current.blur();
  }

  return <div style={{ backgroundColor: "#24292F", padding: 15, boxSizing: "border-box", borderRadius: 25, ...styles }} className={className}>
    <div>
      <Select disabled={disabled} ref={ref} showSearch={true} optionFilterProp="label" style={{ width: "100%", userSelect: "none", fontSize: 18 }} value={activePool?.address} bordered={false} size="large" placeholder="Select a pool" onChange={handleChangePool}>
        {(Object.keys(pools).length < MAX_LENGTH_RECENT_LIST) ? <>
          {Object.keys(pools).map(pool => <Select.Option key={pool} value={pool} style={{ padding: 15, paddingLeft: 20, fontSize: 18 }} label={`${pools[pool].x_symbol} - ${pools[pool].y_symbol}`}>
            {pools[pool].x_symbol} - {pools[pool].y_symbol} <span style={{ opacity: .5, marginLeft: 5, fontWeight: 300 }}>Swap fee: {+Number((pools[pool].swap_fee || paramList.swap_fee.initValue) * 100).toFixed(4)}%</span>
          </Select.Option>)}
        </> : <>
          {recentPools.length > 0 && <Select.OptGroup label="Recent pools">
            {Object.keys(pools).map(pool => recentPools.includes(pool) ? <Select.Option key={pool} value={pool} style={{ padding: 15, paddingLeft: 20, fontSize: 18 }} label={`${pools[pool].x_symbol} - ${pools[pool].y_symbol}`}>
              {pools[pool].x_symbol} - {pools[pool].y_symbol} <span style={{ opacity: .5, marginLeft: 5, fontWeight: 300 }}>Swap fee: {+Number((pools[pool].swap_fee || paramList.swap_fee.initValue) * 100).toFixed(4)}%</span>
            </Select.Option> : null)}
          </Select.OptGroup>}
          <Select.OptGroup label={`${recentPools.length ? "Other" : "All"} pools`}>
            {Object.keys(pools).map(pool => !recentPools.includes(pool) ? <Select.Option key={pool} value={pool} style={{ padding: 15, paddingLeft: 20, fontSize: 18 }} label={`${pools[pool].x_symbol} - ${pools[pool].y_symbol}`}>
              {pools[pool].x_symbol} - {pools[pool].y_symbol} <span style={{ opacity: .5, marginLeft: 5, fontWeight: 300 }}>Swap fee: {+Number((pools[pool].swap_fee || paramList.swap_fee.initValue) * 100).toFixed(4)}%</span>
            </Select.Option> : null)}
          </Select.OptGroup>
        </>}
      </Select>
    </div>
  </div>
}