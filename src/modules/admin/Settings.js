import { useWeb3React } from "@web3-react/core";
import { Button, Form, Input, message, Typography } from "antd";
import { Contract } from "ethers";
import React, { useRef, useState } from "react";
import { SALE_ABI } from "./constants/saleABI";
import { CONFIG } from '../../utils/config';

export function Settings() {
  const { library } = useWeb3React();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sale = useRef(
    new Contract(
      CONFIG.SALE_ADDRESS,
      SALE_ABI,
      library.getSigner()
    )
  );

  async function changeDispatcher({ address }) {
    setIsSubmitting(true);
    try {
      await sale.current.changeDispatcher(address);
      message.success("Dispatcher modificado exitosamente.");
      form.resetFields();
    } catch (error) {
      message.error(error.message || error.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Typography.Title level={3}>Cambiar dispatcher</Typography.Title>
      <Typography.Paragraph>
        La wallet dispatcher debe poseer los tokens que se venderán en cada
        fase.
      </Typography.Paragraph>
      <Form
        colon={false}
        requiredMark={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        form={form}
        name="settings"
        autoComplete="off"
        onFinish={changeDispatcher}
      >
        <Form.Item
          name="address"
          label="Wallet"
          rules={[{ required: true, message: "La wallet es requerida." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item justify="center" wrapperCol={{ span: 24 }}>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            size="large"
          >
            Cambiar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
