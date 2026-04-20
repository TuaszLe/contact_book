import React, { useState } from "react";
import type { ReactElement } from "react";
import { Layout } from "antd";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const { Sider, Content } = Layout;

/* Props mà page nhận */
type PageProps = {
  search?: string;
};

/* Props của AppLayout */
type LayoutProps = {
  children: ReactElement<PageProps>;
};

export default function AppLayout({ children }: LayoutProps) {

  const [collapsed, setCollapsed] = useState(false);
  const [search] = useState("");

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Sidebar collapsed={collapsed} />
      </Sider>

      <Layout>

        {/* Header */}
        <Header/>
        {/* Main Content */}
        <Content
          style={{
            margin: "20px",
            padding: "20px",
            background: "#fff",
            borderRadius: "8px"
          }}
        >
          {React.cloneElement(children, { search })}
        </Content>

        {/* Footer */}
        <Footer />

      </Layout>

    </Layout>
  );
}