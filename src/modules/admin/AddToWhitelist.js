import { useWeb3React } from '@web3-react/core';
import { Button, Input, Typography, Form, message } from 'antd'
import { Contract } from 'ethers';
import React, { useRef, useState } from 'react'
import { SALE_ABI } from './constants/saleABI';

import { CONFIG } from '../../utils/config';

export function AddToWhitelist() {
  const { library } = useWeb3React();
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sale = useRef(new Contract(CONFIG.SALE_ADDRESS, SALE_ABI, library.getSigner()))

  async function addToWhitelist({ addresses }) {
    setIsSubmitting(true)
    try {
      const transaction = await sale.current.addToWhitelist(addresses.split(','))
      await transaction.wait()
      message.success("Wallets agregadas exitosamente.")
      form.resetFields()
    } catch (error) {
      message.error(error?.data?.message || "Error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Typography.Title level={3}>Agregar wallets a la whitelist</Typography.Title>
      <Form
        colon={false}
        requiredMark={false}
        labelAlign="left"
        form={form}
        name="addToWhitelist"
        autoComplete="off"
        onFinish={addToWhitelist}
      >
        <Form.Item
          name="addresses"
          label="Wallets"
          rules={[{ required: true, message: "Al menos una wallet es requerida." }]}
          extra={
            <div>
              Ingrese una o más wallets separadas por coma <b>y sin espacios</b> para agregar a la whitelist.
              <br />
              Ejemplo: 0xbEe12B2ac973BC29727eB1d439e3887583D779C1,0xbEe12B2ac973BC29727eB1d439e3887583D779C2
            </div>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
          >
            Agregar
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}