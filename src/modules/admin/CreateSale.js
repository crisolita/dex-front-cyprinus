import { useWeb3React } from "@web3-react/core";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Input,
  message,
  Radio,
  Typography,
} from "antd";
import { Contract, ethers } from "ethers";
import React, { useRef, useState } from "react";
import { SALE_ABI } from "./constants/saleABI";
import { TOKEN_ABI } from "./constants/tokenABI";
import { CONFIG } from '../../utils/config';

export function CreateSale() {
  const { library } = useWeb3React();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useRef(
    new Contract(
      CONFIG.TOKEN_ADDRESS,
      TOKEN_ABI,
      library.getSigner()
    )
  );
  const sale = useRef(
    new Contract(
      CONFIG.SALE_ADDRESS,
      SALE_ABI,
      library.getSigner()
    )
  );

  async function handleCreatePhase(values) {
    setIsSubmitting(true);
    const phaseType = values.phaseType;
    const minEntry = ethers.utils
      .parseEther(values.minEntry.toString())
      .toString();
    const price = ethers.utils.parseEther(values.price.toString()).toString();
    const endAt = values.endAt.unix();
    const supply = ethers.utils.parseEther(values.supply.toString()).toString();
    const timelock = values.timelock * 24 * 60 * 60;
    const timesToRelease = values.timesToRelease
      .split(",")
      .sort()
      .map((x) => {
        return x * 24 * 60 * 60;
      });
    const percentsToRelease = values.percentsToRelease.split(",");
    console.log(supply, timesToRelease, "tiempos");
    console.log(percentsToRelease, "Porcentajes");
    try {
      const transaction = await token.current.approve(
        CONFIG.SALE_ADDRESS,
        supply
      );
      await transaction.wait();
      const transaction2 = await sale.current.createPhase(
        phaseType,
        minEntry,
        price,
        endAt,
        supply,
        timelock,
        timesToRelease,
        percentsToRelease
      );
      await transaction2.wait();

      message.success("Fase creada exitosamente.");
      form.resetFields();
    } catch (error) {
      message.error(error.message || error.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Typography.Title level={3}>Crear fase de venta</Typography.Title>
      <Form
        colon={false}
        requiredMark={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        form={form}
        name="createSale"
        autoComplete="off"
        onFinish={handleCreatePhase}
      >
        <Form.Item
          label="Cantidad a vender"
          name="supply"
          rules={[
            {
              type: "number",
              required: true,
              min: 0,
              message: "La cantidad de tokens a vender es requerida.",
            },
          ]}
        >
          <InputNumber autoFocus />
        </Form.Item>
        <Form.Item
          label="Mīnimo de compra"
          name="minEntry"
          dependencies={["supply"]}
          rules={[
            {
              type: "number",
              min: 1,
              required: true,
              message: "El mīnimo de compra es requerido y debe ser mayor a 1.",
            },
            ({ getFieldValue }) => ({
              validator(_, minEntry) {
                if (!minEntry) {
                  return Promise.resolve();
                }
                if (getFieldValue("supply") < minEntry) {
                  return Promise.reject(
                    new Error(
                      "El mīnimo de compra debe ser mayor a la cantidad de tokens a vender en esta fase."
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Precio en dólares"
          name="price"
          rules={[
            {
              type: "number",
              required: true,
              message: "El precio en dolares es requerido.",
            },
          ]}
        >
          <InputNumber formatter={(value) => `$${value}`} />
        </Form.Item>
        <Form.Item
          label="Fecha de finalización"
          name="endAt"
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
        <Form.Item
          label="Días de bloqueo"
          name="timelock"
          rules={[
            {
              type: "number",
              required: true,
              min: 0,
              message: "El tiempo de bloqueo es requerido",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Días de desbloqueo"
          name="timesToRelease"
          rules={[
            {
              type: "string",
              required: true,
              message: "Los dias de desbloqueo respectivos son requeridos",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Porcentajes de desbloqueo"
          name="percentsToRelease"
          rules={[
            {
              type: "string",
              required: true,
              message:
                "Los porcentajes de desbloqueo respectivos son requeridos",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tipo de fase"
          name="phaseType"
          rules={[{ required: true, message: "El tipo de fase es requerido" }]}
        >
          <Radio.Group>
            <Radio value={true}>Pública</Radio>
            <Radio value={false}>Privada</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item justify="center" wrapperCol={{ span: 24 }}>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            size="large"
          >
            Crear
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
