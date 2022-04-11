import { useWeb3React } from '@web3-react/core';
import { Button, Input, Typography, Form, message } from 'antd'
import { Contract } from 'ethers';
import React, { useRef, useState } from 'react'
import { SALE_ABI } from './constants/saleABI';
import { CONFIG } from '../../utils/config';

export function RemoveFromWhitelist() {
  const { library } = useWeb3React();
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sale = useRef(new Contract(CONFIG.SALE_ADDRESS, SALE_ABI, library.getSigner()))

  async function removeFromWhitelist() {
    setIsSubmitting(true);
    try {
      const transaction = await sale.current.removeWhitelistedAddress();
      await transaction.wait();
      message.success("Wallets eliminadas exitosamente.");
      form.resetFields();
    } catch (error) {
      message.error(error.message || error.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Typography.Title level={3}>
        Eliminar wallets de la whitelist
      </Typography.Title>

      <Button
        onClick={removeFromWhitelist}
        disabled={isSubmitting}
        loading={isSubmitting}
        type="primary"
        danger
        htmlType="submit"
      >
        Eliminar
      </Button>
    </>
  );
}