import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Card,
  Tag,
  Space,
  Avatar,
  Typography,
  Row,
  Col,
  Button,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  ClearOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getContacts } from "../../services/api";

const { Text } = Typography;
const { Option } = Select;

interface Contact {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  phone: string;
  email: string;
  title_name?: string;
  contact_type?: string;
  contact_location_name?: string;
}

// Màu tag theo loại liên hệ
const typeColor: Record<string, string> = {
  "Nội bộ": "blue",
  "Khách hàng": "green",
  "Nhà thầu": "orange",
  "Đối tác": "purple",
};

// Lấy chữ cái đầu họ tên cho avatar
function getInitials(name: string) {
  const parts = name?.trim().split(" ") ?? [];
  if (parts.length === 0) return "?";
  const last = parts[parts.length - 1];
  return last.charAt(0).toUpperCase();
}

// Màu avatar theo chữ cái
const avatarColors = [
  "#1677ff", "#0e9488", "#7c3aed", "#ea580c",
  "#db2777", "#059669", "#d97706", "#2563eb",
];
function getAvatarColor(name: string) {
  const code = (name?.charCodeAt(0) ?? 0);
  return avatarColors[code % avatarColors.length];
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterLocation, setFilterLocation] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getContacts();
        setContacts(data ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Lấy danh sách loại và đơn vị unique
  const typeOptions = useMemo(
    () => [...new Set(contacts.map((c) => c.contact_type).filter(Boolean))],
    [contacts]
  );
  const locationOptions = useMemo(
    () => [...new Set(contacts.map((c) => c.contact_location_name).filter(Boolean))],
    [contacts]
  );

  // Lọc phía client
  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const name = c.fullname?.toLowerCase() ?? "";
      const phone = c.phone?.toLowerCase() ?? "";
      const email = c.email?.toLowerCase() ?? "";
      if (searchName && !name.includes(searchName.toLowerCase())) return false;
      if (searchPhone && !phone.includes(searchPhone.toLowerCase())) return false;
      if (searchEmail && !email.includes(searchEmail.toLowerCase())) return false;
      if (filterType && c.contact_type !== filterType) return false;
      if (filterLocation && c.contact_location_name !== filterLocation) return false;
      return true;
    });
  }, [contacts, searchName, searchPhone, searchEmail, filterType, filterLocation]);

  const hasFilter = searchName || searchPhone || searchEmail || filterType || filterLocation;

  const clearAll = () => {
    setSearchName("");
    setSearchPhone("");
    setSearchEmail("");
    setFilterType(undefined);
    setFilterLocation(undefined);
  };

  const columns: ColumnsType<Contact> = [
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
      width: 220,
      sorter: (a, b) => (a.fullname ?? "").localeCompare(b.fullname ?? ""),
      render: (name: string) => (
        <Space size={10}>
          <Avatar
            size={34}
            style={{
              backgroundColor: getAvatarColor(name),
              flexShrink: 0,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {getInitials(name)}
          </Avatar>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (phone: string) =>
        phone ? (
          <a href={`tel:${phone}`} style={{ color: "#0e9488", fontSize: 13 }}>
            <PhoneOutlined style={{ marginRight: 5 }} />
            {phone}
          </a>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (email: string) =>
        email ? (
          <a href={`mailto:${email}`} style={{ color: "#1677ff", fontSize: 13 }}>
            <MailOutlined style={{ marginRight: 5 }} />
            {email}
          </a>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
    },
    {
      title: "Chức vụ",
      dataIndex: "title_name",
      key: "title_name",
      width: 160,
      ellipsis: true,
      render: (v: string) => (
        <Text style={{ fontSize: 13 }} type={v ? undefined : "secondary"}>
          {v || "—"}
        </Text>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "contact_location_name",
      key: "contact_location_name",
      ellipsis: { showTitle: false },
      render: (v: string) => (
        <Tooltip title={v}>
          <Text style={{ fontSize: 13 }} type={v ? undefined : "secondary"}>
            {v || "—"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Loại",
      dataIndex: "contact_type",
      key: "contact_type",
      width: 110,
      render: (type: string) =>
        type ? (
          <Tag
            color={typeColor[type] ?? "default"}
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            {type}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Danh bạ liên hệ
        </Typography.Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Tổng cộng{" "}
          <strong>{contacts.length}</strong> liên hệ
          {hasFilter && (
            <>
              {" "}—{" "}đang hiển 
              <strong style={{ color: "#1677ff" }}>{filtered.length}</strong> kết quả
            </>
          )}
        </Text>
      </div>

      {/* Bộ lọc */}
      <Card
        style={{ marginBottom: 16, borderRadius: 10 }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              placeholder="Tìm theo họ tên"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Input
              prefix={<PhoneOutlined style={{ color: "#bbb" }} />}
              placeholder="Tìm theo số điện thoại"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Input
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="Tìm theo email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: "100%", borderRadius: 8 }}
              placeholder="Loại liên hệ"
              allowClear
              value={filterType}
              onChange={setFilterType}
              suffixIcon={<TeamOutlined />}
            >
              {typeOptions.map((t) => (
                <Option key={t} value={t}>
                  <Tag
                    color={typeColor[t as string] ?? "default"}
                    style={{ margin: 0 }}
                  >
                    {t}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="Đơn vị"
              allowClear
              showSearch
              value={filterLocation}
              onChange={setFilterLocation}
            >
              {locationOptions.map((l) => (
                <Option key={l} value={l}>
                  {l}
                </Option>
              ))}
            </Select>
          </Col>
          {hasFilter && (
            <Col xs={24} sm={12} md={24} style={{ textAlign: "right" }}>
              <Button
                icon={<ClearOutlined />}
                size="small"
                onClick={clearAll}
                style={{ fontSize: 12 }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          )}
        </Row>
      </Card>

      {/* Bảng */}
      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "30", "50"],
            showTotal: (total) => `Tổng ${total} liên hệ`,
            size: "small",
          }}
          size="small"
          rowHoverBg="#fafafa"
          style={{ fontSize: 13 }}
          rowClassName={() => "contact-row"}
          scroll={{ x: 900 }}
        />
      </Card>

      <style>{`
        .contact-row:hover td {
          background: #f0f7ff !important;
          cursor: pointer;
        }
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-size: 13px;
          font-weight: 600;
          color: #555;
        }
        .ant-pagination {
          padding: 12px 16px;
        }
      `}</style>
    </div>
  );
}
