import { useWeb3React } from "@web3-react/core";
import { Button, Input, Typography, Form, message, DatePicker } from "antd";
import { Contract } from "ethers";
import React, { useRef, useState } from "react";
import { SALE_ABI } from "./constants/saleABI";
import { CONFIG } from '../../utils/config';

export function ChangeEndDate() {
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

  async function changeEndDate({ fecha }) {
    setIsSubmitting(true);
    try {
      const transaction = await sale.current.changeEndDate(fecha.unix());
      await transaction.wait();
      message.success("Fecha cambiada exitosamente.");
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Typography.Title level={3}>
        Cambiar fecha de finalizacion
      </Typography.Title>
      <Form
        colon={false}
        requiredMark={false}
        labelAlign="left"
        form={form}
        name="changeEndDate"
        autoComplete="off"
        onFinish={changeEndDate}
      >
        <Form.Item
          name="fecha"
          label="Nueva fecha"
          rules={[
            {
              required: true,
              message: "La fecha de finalización es requerida.",
            },
            () => ({
              validator(_, endAt) {
                if (!endAt || endAt.isAfter(new Date())) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "La fecha de finalización debe ser mayor a la fecha actual."
                );
              },
            }),
          ]}
        >
          <DatePicker placeholder="Seleccione una fecha" />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
          >
            Cambiar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
