import React, { useState } from "react";
import type { ReactElement } from "react";
import { Layout } from "antd";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const { Sider, Content } = Layout;

type PageProps = {
  search?: string;
};

type LayoutProps = {
  children: ReactElement<PageProps>;
};

const SIDER_WIDTH = 200;
const SIDER_COLLAPSED_WIDTH = 80;

export default function AppLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search] = useState("");

  const siderWidth = collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH;

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Sidebar cố định — không cuộn theo trang */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 100,
          scrollbarWidth: "none",       /* Firefox */
        }}
      >
        <Sidebar collapsed={collapsed} />
      </Sider>

      {/* Phần nội dung dịch sang phải theo độ rộng sidebar */}
      <Layout style={{ marginLeft: siderWidth, transition: "margin-left 0.2s" }}>

        <Header />

        <Content
          style={{
            margin: "20px",
            padding: "20px",
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          {React.cloneElement(children, { search })}
        </Content>

        <Footer />

      </Layout>

    </Layout>
  );
}
