import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

export const InfoTooltip = ({ title }) => {
  return <span onClick={(e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  }}>
    <Tooltip title={title} trigger={["hover"]} align="center" style={{ marginLeft: 5 }}>
      <InfoCircleOutlined style={{ opacity: .4 }} />
    </Tooltip>
  </span>
}