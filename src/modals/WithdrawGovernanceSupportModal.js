import { Button, Input, Modal, Space, Form, Typography, Tooltip } from "antd";
import QRButton from "obyte-qr-button";
import { useState, useRef } from "react";

import { generateLink } from "utils/generateLink";

const { Text } = Typography;

export const WithdrawGovernanceSupportModal = ({
  disabled = false,
  max,
  symbol,
  activeGovernance,
  activeWallet,
  voteTokenDecimals,
  children,
  choiceParams = []
}) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const btnWithdraw = useRef();

  const [amount, setAmount] = useState({
    value: undefined,
    valid: false,
  });

  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (value === "" || value === "0") {
      setAmount({ value, valid: false });
    } else {
      if (
        (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <=
        voteTokenDecimals
      ) {
        if (reg.test(String(value))) {
          setAmount({ value, valid: true });
        } else {
          setAmount({ value, valid: false });
        }
      }
    }
  };

  const link = generateLink({
    amount: 1e4,
    data: {
      withdraw: 1,
      amount:
        amount.value !== "" && amount.value !== undefined
          ? Math.round(amount.value * 10 ** voteTokenDecimals)
          : undefined,
    },
    from_address: activeWallet,
    aa: activeGovernance,
    is_single: true
  });

  const onCancel = () => {
    setVisible(false);
    setAmount({
      value: undefined,
      valid: false,
    });
  };

  return (
    <>
      {choiceParams.length === 0 ? <Button type="link" style={{ padding: 0, height: "auto", border: 0 }} disabled={disabled} onClick={showModal}>
        <b>{children || "Withdraw"}</b>
      </Button> : <Text disabled>
        <Tooltip title={<>To be able to withdraw, you need to remove support from these fields: <b>{choiceParams.join(", ").toLowerCase()}</b>.</>}>
          <b>{children || "Withdraw"}</b>
        </Tooltip>
      </Text>}

      <Modal
        visible={visible}
        onCancel={onCancel}
        destroyOnClose
        title="Withdraw support"
        footer={
          <Space>
            <Button key="Cancel" onClick={onCancel}>
              Cancel
            </Button>
            <QRButton
              key="submit"
              type="primary"
              ref={btnWithdraw}
              href={link}
              disabled={
                (amount.value !== "" &&
                  amount.value !== undefined &&
                  amount.valid === false) ||
                Number(amount.value) * 10 ** voteTokenDecimals > max
              }>
              Withdraw
            </QRButton>
          </Space>
        }
      >
        <Form size="large">
          <Form.Item extra="Leave empty if you want to withdraw the entire amount">
            <Input
              placeholder={`Amount to withdraw (Max: ${max / 10 ** voteTokenDecimals})`}
              autoComplete="off"
              autoFocus={true}
              size="large"
              onChange={handleChangeAmount}
              value={amount.value}
              suffix={symbol}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  if (
                    !(
                      (amount.value !== "" &&
                        amount.value !== undefined &&
                        amount.valid === false) ||
                      Number(amount.value) > max
                    )
                  ) {
                    btnWithdraw.current.click();
                    setTimeout(() => {
                      onCancel();
                    }, 100);
                  }
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}