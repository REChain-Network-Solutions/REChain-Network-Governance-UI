import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Button, Space, Typography, Alert, Tooltip } from "antd";
import QRButton from "obyte-qr-button";

import { generateLink } from "utils/generateLink";
import { paramList } from "paramList";
import { AddWalletModal } from "./AddWalletModal";

const { Text, Paragraph } = Typography;

const f = (x) => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);

export const ChangeParamsModal = ({ shortName, poolDefParams, supportedValue, governance_state, actualValue, description, name, activeGovernance, voteTokenAddress, voteTokenDecimals, voteTokenSymbol, balance = 0, isMyChoice, activeWallet, disabled, mid_price_decimals, allActualParams, x_symbol, y_symbol }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const btnRef = useRef();
  const isPercentage = paramList[name].isPercentage;
  const showPriceRange = name === 'mid_price' || name === 'price_deviation';
  const { alpha, mid_price, price_deviation } = allActualParams;

  const [paramValue, setParamValue] = useState({
    value: "",
    valid: false,
  });

  const [amount, setAmount] = useState({
    value: "",
    valid: false,
  });

  const parameterInfo = paramList?.[name];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reg = name === "period_length" ? /^[0-9]+$/ : /^(0|[.1-9])+$/;

  const handleChangeParamValue = (ev) => {
    const value = ev.target.value;

    if (value === "") {
      setParamValue({ value: "", valid: false });
    } else if (reg.test(value) && (f(value) <= 4 || !isPercentage)) {
      if (parameterInfo.validator(value / (isPercentage ? 100 : 1), actualValue, governance_state, poolDefParams)) {
        setParamValue({ value, valid: true });
      } else {
        setParamValue({ value, valid: false });
      }
    }
  };

  const handleChangeAmount = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;

    if (value === "" || value === "0") {
      setAmount({ value, valid: undefined });
    } else {
      if (f(value) <= voteTokenDecimals) {
        if (reg.test(String(value))) {
          setAmount({ value, valid: true });
        } else {
          setAmount({ value, valid: false });
        }
      }
    }
  };

  useEffect(() => {
    let transformedValue = supportedValue;
    if (isPercentage && supportedValue !== undefined) {
      transformedValue = supportedValue * 100
    } if (name === "mid_price"){
      transformedValue = +Number(supportedValue / 10 ** mid_price_decimals).toPrecision(6);
    } else {
      transformedValue = supportedValue
    }

    setParamValue({
      value: transformedValue || "",
      valid: supportedValue !== undefined
    });

    setAmount({
      value: undefined,
      valid: false,
    });

  }, [isModalVisible]);

  if (!name) return null;

  let sentValue = paramValue.value;

  if (isPercentage) {
    sentValue = +Number(sentValue / 100).toFixed(6)
  } else if (name === "mid_price") {
    sentValue = sentValue * 10 ** mid_price_decimals;
  }

  const link = generateLink({
    amount: amount.valid ? Math.round(amount.value * 10 ** voteTokenDecimals) : 1e4,
    asset: amount.valid ? voteTokenAddress : undefined,
    data: {
      name,
      value: sentValue
    },
    aa: activeGovernance,
    from_address: activeWallet,
    is_single: true
  });

  const finalSupport = Number(balance) + (amount.valid ? Number(amount.value * 10 ** voteTokenDecimals) : 0);

  const handleKeyDown = (ev) => {
    if (ev.key === "Enter") {
      if (finalSupport !== 0 && paramValue.valid) {
        btnRef.current.click();
      }
    }
  }

  let p_min;
  let p_max;

  if (showPriceRange) {
    const pd = name === "price_deviation" && paramValue.valid ? Number(sentValue) : price_deviation;
    const mp = (name === "mid_price" && paramValue.valid ? Number(sentValue) : mid_price) / 10 ** mid_price_decimals;

    const beta = 1 - alpha;

    if (mp === 0 || pd === 0) {
      p_max = "Infinity";
      p_min = 0;
    } else {
      p_max = (alpha / beta * pd ** (1 / beta) * mp).toPrecision(6);
      p_min = (alpha / beta / pd ** (1 / beta) * mp).toPrecision(6);
    }
  }

  return (
    <>
      {!activeWallet ? <Tooltip zIndex={99} title={<div>
        Please <AddWalletModal>add your address</AddWalletModal> first
      </div>}>
        <Text disabled>{supportedValue !== undefined ? (isMyChoice ? "add support for this value" : "vote for this value") : "suggest another value"}</Text>
      </Tooltip> : <Button type="link" style={{ padding: 0, height: "auto" }} disabled={disabled} onClick={showModal}>
        {supportedValue !== undefined ? (isMyChoice ? "add support for this value" : "vote for this value") : "suggest another value"}
      </Button>}
      <Modal width={700} title={`Change ${String(shortName).toLowerCase()}`} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
        footer={
          <Space>
            <Button key="Cancel" onClick={handleCancel}>Close</Button>
            <QRButton
              key="submit"
              type="primary"
              href={link}
              ref={btnRef}
              style={{ margin: 0 }}
              disabled={
                paramValue.value === undefined || paramValue.value === "" || !paramValue.valid || (isMyChoice
                  ? Number(amount.value) === 0 || !amount.valid
                  : finalSupport === 0 || !paramValue.valid)
              }
              onClick={() =>
                setTimeout(() => {
                  handleCancel();
                }, 100)
              }
            >
              {isMyChoice ? "Add support" : "Vote"}
            </QRButton>
          </Space>
        }
      >
        {description && <Alert style={{ marginBottom: 15 }} message={description} banner type="info" showIcon />}
        <Form size="middle" layout="vertical">
          <Text type="secondary">Parameter value:</Text>
          <Form.Item
            hasFeedback
            validateStatus={((!paramValue.valid && paramValue.value !== "")) ? "error" : undefined}
            help={((!paramValue.valid && paramValue.value !== "")) ? parameterInfo.rule : undefined}
          >
            <Input
              placeholder={name !== "alpha" ? shortName : `${shortName} (weight of the first token)`}
              size="large"
              autoComplete="off"
              spellCheck="false"
              autoFocus={supportedValue === undefined}
              disabled={supportedValue !== undefined}
              onChange={handleChangeParamValue}
              value={paramValue.value}
              onKeyDown={handleKeyDown}
              suffix={isPercentage ? <span>%</span> : ""}
            />
          </Form.Item>

          {showPriceRange && <Paragraph>
            <Text>Price range from {p_min} to {p_max} {y_symbol} for 1 {x_symbol}</Text>
          </Paragraph>}
          
          {balance !== 0 && balance !== "0" ? <Text type="secondary">Add more funds (optional):</Text> : <Text type="secondary">Amount to vote with</Text>}
          <Form.Item>
            <Input
              placeholder={`Amount in ${voteTokenSymbol || "TOKEN"}`}
              autoComplete="off"
              size="large"
              onChange={handleChangeAmount}
              suffix={voteTokenSymbol || "TOKEN"}
              autoFocus={supportedValue !== undefined}
              value={amount.value}
              onKeyDown={handleKeyDown}
            />
          </Form.Item>
        </Form>

        <Paragraph>
          <Text>
            <b>Your balance: </b>
            {+Number(balance / 10 ** voteTokenDecimals).toFixed(voteTokenDecimals)} {voteTokenSymbol || "TOKEN"}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>
            <b>Final support: </b>
            {+Number(finalSupport / 10 ** voteTokenDecimals).toFixed(voteTokenDecimals)} {voteTokenSymbol}
          </Text>
        </Paragraph>
        <Paragraph type="warning">
          Your funds will be locked on the governance AA and you'll be able to withdraw them after 10-day challenging period and 30-day freeze period expire.
        </Paragraph>
      </Modal>
    </>
  );
};