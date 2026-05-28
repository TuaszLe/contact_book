import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  ToolOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

type Props = {
  collapsed: boolean;
};

export default function Sidebar({ collapsed }: Props) {
  return (
    <Menu
      theme="dark"
      mode="inline"
      inlineCollapsed={collapsed}
      style={{ height: "100%" }}
      items={[
        {
          key: "1",
          icon: <DashboardOutlined />,
          label: <Link to="/">Dashboard</Link>,
        },
        {
          key: "2",
          icon: <UserOutlined />,
          label: <Link to="/contacts">Contacts</Link>,
        },
        {
          key: "3",
          icon: <span>🏢</span>,
          label: <Link to="/office">Office</Link>,
        },
        {
          key: "4",
          icon: <span>🚧</span>,
          label: <Link to="/tollplaza">TollPlaza</Link>,
        },
        {
          key: "5",
          icon: <span>🅿️</span>,
          label: <Link to="/Parking">Parking</Link>,
        },
        {
          key: "6",
          icon: <ToolOutlined />,
          label: <Link to="/mtnc">Lịch bảo trì</Link>,
        },
        {
          key: "7",
          icon: <PhoneOutlined />,
          label: <Link to="/so">Đầu mối cảnh báo</Link>,
        },
        {
          key: "8",
          icon: <PhoneOutlined />,
          label: <Link to="/ds_truong_tuyen">Danh sách trường tuyến</Link>,
        },
        {
          key: "9",
          icon: <PhoneOutlined />,
          label: <Link to="/xu_ly_lv_1">Xử lý level 1</Link>,
        },
      ]}
    />
  );
}
