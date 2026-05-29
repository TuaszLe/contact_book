import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Spin,
  Empty,
  Typography,
  Space,
  Tag,
  Avatar,
  Button,
  Divider,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getOfficeDetail } from "../../services/api";

const { Text, Title } = Typography;

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  title_name: string;
}

interface Office {
  id: number;
  name: string;
  description?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

const avatarColors = [
  "#1677ff", "#0e9488", "#7c3aed", "#ea580c",
  "#db2777", "#059669", "#d97706", "#2563eb",
];
function getAvatarColor(name: string) {
  return avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];
}
function getInitials(name: string) {
  const parts = name?.trim().split(" ") ?? [];
  return parts[parts.length - 1]?.charAt(0).toUpperCase() ?? "?";
}

export default function OfficeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [office, setOffice] = useState<Office | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchContact, setSearchContact] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOfficeDetail(Number(id));
        setOffice(data.office);
        setContacts(data.contacts ?? []);
        setError(null);
      } catch {
        setError("Không thể tải thông tin văn phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error || !office) {
    return (
      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/office")} style={{ marginBottom: 16 }}>Quay lại</Button>
        <Empty description={error || "Không tìm thấy dữ liệu"} />
      </div>
    );
  }

  const filteredContacts = contacts.filter((c) =>
    c.fullname?.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.phone?.includes(searchContact) ||
    c.email?.toLowerCase().includes(searchContact.toLowerCase())
  );

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div>
      {/* Nút quay lại */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/office")}
        style={{ marginBottom: 16, borderRadius: 8 }}
      >
        Quay lại danh sách
      </Button>

      {/* Hero header */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: "linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)",
          border: "1.5px solid #bae0ff",
        }}
        styles={{ body: { padding: "24px 28px" } }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "#1677ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <BankOutlined />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
              {office.name}
            </Title>
            {office.description && (
              <Text type="secondary" style={{ fontSize: 14, display: "block", marginTop: 4 }}>
                {office.description}
              </Text>
            )}
          </div>
        </div>

        <Divider style={{ margin: "16px 0 12px" }} />

        <Row gutter={32}>
          <Col>
            <Space>
              <TeamOutlined style={{ color: "#1677ff" }} />
              <Text style={{ fontSize: 13 }}>
                <strong>{contacts.length}</strong> liên hệ
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <CalendarOutlined style={{ color: "#999" }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Tạo: {formatDate(office.created_at)}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <CalendarOutlined style={{ color: "#999" }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Cập nhật: {formatDate(office.updated_at)}
              </Text>
            </Space>
          </Col>
          {office.status != null && (
            <Col>
              <Tag color={office.status === 1 ? "success" : "default"}>
                {office.status === 1 ? "Hoạt động" : "Ngừng hoạt động"}
              </Tag>
            </Col>
          )}
        </Row>
      </Card>

      {/* Danh sách liên hệ */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Danh sách liên hệ</span>
            <Tag color="blue">{contacts.length} người</Tag>
          </Space>
        }
        extra={
          <input
            placeholder="Tìm trong danh sách..."
            value={searchContact}
            onChange={(e) => setSearchContact(e.target.value)}
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 13,
              outline: "none",
              width: 200,
            }}
          />
        }
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
      >
        {contacts.length === 0 ? (
          <div style={{ padding: 32 }}>
            <Empty description="Chưa có liên hệ nào trong văn phòng này" />
          </div>
        ) : (
          <Table
            rowKey="id"
            size="small"
            dataSource={filteredContacts}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `${total} liên hệ`,
              size: "small",
            }}
            scroll={{ x: 700 }}
            rowClassName={() => "office-contact-row"}
            columns={[
              {
                title: "Họ tên",
                dataIndex: "fullname",
                sorter: (a, b) => (a.fullname ?? "").localeCompare(b.fullname ?? ""),
                render: (name: string) => (
                  <Space size={10}>
                    <Avatar
                      size={32}
                      style={{
                        backgroundColor: getAvatarColor(name),
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(name)}
                    </Avatar>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>{name}</Text>
                  </Space>
                ),
              },
              {
                title: "Điện thoại",
                dataIndex: "phone",
                width: 150,
                render: (v: string) =>
                  v ? (
                    <a href={`tel:${v}`} style={{ color: "#0e9488", fontSize: 13 }}>
                      <PhoneOutlined style={{ marginRight: 5 }} />{v}
                    </a>
                  ) : <Text type="secondary">—</Text>,
              },
              {
                title: "Email",
                dataIndex: "email",
                ellipsis: true,
                render: (v: string) =>
                  v ? (
                    <Tooltip title={v}>
                      <a href={`mailto:${v}`} style={{ color: "#1677ff", fontSize: 13 }}>
                        <MailOutlined style={{ marginRight: 5 }} />{v}
                      </a>
                    </Tooltip>
                  ) : <Text type="secondary">—</Text>,
              },
              {
                title: "Chức vụ",
                dataIndex: "title_name",
                width: 180,
                ellipsis: true,
                render: (v: string) =>
                  v ? <Text style={{ fontSize: 13 }}>{v}</Text> : <Text type="secondary">—</Text>,
              },
            ]}
          />
        )}
      </Card>

      <style>{`
        .office-contact-row:hover td {
          background: #f0f7ff !important;
        }
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 600;
          font-size: 13px;
        }
        .ant-pagination { padding: 12px 16px; }
      `}</style>
    </div>
  );
}
