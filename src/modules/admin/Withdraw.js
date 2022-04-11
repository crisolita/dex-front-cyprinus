import { useWeb3React } from "@web3-react/core";
import { InputNumber, Button, Input, Typography, Form, message } from "antd";
import { Contract, ethers } from "ethers";
import React, { useRef, useState } from "react";
import { SALE_ABI } from "./constants/saleABI";
import { CONFIG } from "../../utils/config";

export function Withdraw() {
  const { library } = useWeb3React();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sale = useRef(
    new Contract(CONFIG.SALE_ADDRESS, SALE_ABI, library.getSigner())
  );

  async function withdraw(values) {
    setIsSubmitting(true);
    const amount = ethers.utils.parseEther(values.amount.toString());
    try {
      const transaction = await sale.current.withdraw(values.address, amount);
      await transaction.wait();
      message.success("Fondos retirados exitosamente.");
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Typography.Title level={3}>Retirar fondos</Typography.Title>
      <Form
        colon={false}
        requiredMark={false}
        labelAlign="left"
        form={form}
        name="withdraw"
        autoComplete="off"
        onFinish={withdraw}
      >
        <Form.Item
          name="address"
          label="Wallet"
          rules={[{ required: true, message: "La wallet es requerida." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Cantidad a retirar"
          name="amount"
          rules={[
            {
              type: "number",
              required: true,
              min: 0,
              message: "La cantidad a retirar es requerida.",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
          >
            Retirar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
