import { useWeb3React } from "@web3-react/core";
import { Button, Input, Typography, Form, message, Collapse } from "antd";
import { Contract } from "ethers";
import React, { useRef, useState } from "react";
import { SALE_ABI } from "./constants/saleABI";
import { CONFIG } from '../../utils/config';
import { CaretRightOutlined } from "@ant-design/icons";

export function ShowWhitelist() {
  const { library } = useWeb3React();
  const sale = useRef(
    new Contract(
      CONFIG.SALE_ADDRESS,
      SALE_ABI,
      library.getSigner()
    )
  );
  const [whiteWallets, updateWallets] = useState([]);
  async function getWhitelist() {
    try {
      const whitelist = await sale.current.getWhitelist();
      updateWallets(whitelist);
    } catch (error) {
      message.error(error.message || error.data?.message || "Error");
    }
  }

  return (
    <>
      <Typography.Title level={3}></Typography.Title>

      <Collapse
        bordered={false}
        onChange={getWhitelist}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
      >
        <Collapse.Panel
          header="Wallets dentro de la whitelist"
          key="1"
          className="site-collapse-custom-panel"
        >
          {whiteWallets.map((address) => {
            if (address !== "0x0000000000000000000000000000000000000000") {
              return <li key={address}>{address}</li>;
            }
          })}
        </Collapse.Panel>
      </Collapse>
    </>
  );
}