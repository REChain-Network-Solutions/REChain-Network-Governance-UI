import { Button, Form, Input, Modal, Typography } from "antd";
import obyte from "obyte";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { changeWallet, selectWallet } from "store/slices/settingsSlice";

export const AddWalletModal = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [wallet, setWallet] = useState({ value: undefined, valid: false });

  const activeWallet = useSelector(selectWallet);

  const dispatch = useDispatch();
  const ref = useRef();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const saveWallet = () => {
    dispatch(changeWallet(wallet.value));
    handleCancel();
  };

  const handleKeyPress = (ev) => {
    if (ev.key === "Enter") {
      if (wallet.valid) {
        saveWallet();
      }
    }
  }

  useEffect(() => {
    if (isModalVisible) {
      ref.current.focus();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (activeWallet) {
      setWallet({ value: activeWallet, valid: true });
    }
  }, [activeWallet]);

  const handleChangeWallet = (ev) => {
    const wallet = ev.target.value;
    if (wallet) {
      if (obyte.utils.isValidAddress(wallet)) {
        setWallet({ value: wallet, valid: true })
      } else {
        setWallet({ value: wallet, valid: false })
      }
    } else {
      setWallet({ value: undefined, valid: false })
    }
  }

  return <>
    <Typography.Link onClick={showModal} size={children ? "small" : "large"} type="link">
      {activeWallet ? activeWallet : children}
    </Typography.Link>
    <Modal width={650} title={null} footer={null} visible={isModalVisible} onCancel={handleCancel}>
      <Typography.Title level={3}>{activeWallet ? "Change" : "Add"} wallet</Typography.Title>
      <Form>
        <Form.Item extra={<Typography.Text type="danger">{wallet.value && !wallet.valid ? "Wallet address isn't valid" : ""}</Typography.Text>}>
          <span style={{ fontSize: 16, color: "#3F474D", fontWeight: "bold" }}>Wallet address</span>
          <Input ref={ref} style={{ padding: 0, borderRadius: 0, fontSize: 28 }} value={wallet.value} bordered={false} size="large" placeholder="VYC2LXE..." onChange={handleChangeWallet} onKeyPress={handleKeyPress} />
          <small><a href="https://obyte.org/#download" target="_blank">Install Obyte wallet</a> if you don't have one yet, and copy/paste your address here.</small>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        <Button type="primary" size="large" disabled={!wallet.valid || activeWallet === wallet.value} onClick={saveWallet}>{activeWallet ? "Change" : "Add"}</Button>
      </div>
    </Modal>
  </>
}