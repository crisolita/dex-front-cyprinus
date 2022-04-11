import { useWeb3React } from "@web3-react/core";
import { Col, Layout, Menu, Row, Tabs, Typography } from "antd";
import { AddToWhitelist } from "./AddToWhitelist";
import { CreateSale } from "./CreateSale";
import { Dashboard } from "./Dashboard";
import { RemoveFromWhitelist } from "./RemoveFromWhitelist";
import { Settings } from "./Settings";
import { Withdraw } from "./Withdraw";
import { ChangeEndDate } from "./ChangeEndDate";
import { ShowWhitelist } from "./ShowWhitelist";

export function AdminPanel() {
  const { account } = useWeb3React();

  return (
    <Layout style={{ minHeight: "70vh", background: 'transparent' }}>
      <div className="container">
        <Typography.Title
          level={5}
          style={{
            background: "#208b37",
            color: "#FFF",
            textAlign: "center",
            padding: "0.3rem",
          }}
        >
          Bienvenido: <b>{account}</b>
        </Typography.Title>
        <Layout.Content>
          <Tabs defaultActiveKey="1" size="large" centered animated>
            <Tabs.TabPane tab="Dashboard" key="1">
              <Dashboard />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Ventas" key="2">
              <Row justify="center">
                <Col span={12}>
                  <CreateSale />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Whitelist" key="3">
              <Row justify="center">
                <Col span={18}>
                  <AddToWhitelist />
                </Col>
              </Row>
              <Row justify="center">
                <Col span={18}>
                  <ShowWhitelist />
                </Col>
              </Row>
              <Row justify="center">
                <Col span={18}>
                  <RemoveFromWhitelist />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Retiro" key="4">
              <Row justify="center">
                <Col span={12}>
                  <Withdraw />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Configuración" key="5">
              <Row justify="center">
                <Col span={12}>
                  <Settings />
                  <ChangeEndDate />
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </div>
    </Layout>
  );
}
