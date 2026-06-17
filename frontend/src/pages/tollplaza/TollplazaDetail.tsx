import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Tag,
  Spin,
  Empty,
  Typography,
  Space,
  Avatar,
  Button,
  Divider,
  Tooltip,
  Row,
  Col,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  ApartmentOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CarOutlined,
  ProjectOutlined,
  WifiOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { getTollplazaDetail } from "../../services/api";

const { Text, Title } = Typography;

interface Contact {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  title_name?: string;
}

interface Tollplaza {
  id: number;
  name: string;
  description?: string;
  address?: string;
  project?: number;
  project_name?: string;
  type?: number;
  type_name?: string;
  channel_codes?: string[];
  channel_names?: string[];
  lanes?: number;
  status?: number;
  lat?: number;
  lng?: number;
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

function InfoItem({
  icon,
  label,
  value,
  color = "#1677ff",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 14px",
        background: "#fafafa",
        borderRadius: 8,
        border: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2 }}>
          {label}
        </Text>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

export default function TollplazaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tollplaza, setTollplaza] = useState<Tollplaza | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchContact, setSearchContact] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTollplazaDetail(Number(id));
        setTollplaza(data.tollplaza);
        setContacts(data.contacts ?? []);
        setError(null);
      } catch {
        setError("Không thể tải thông tin trạm thu phí");
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

  if (error || !tollplaza) {
    return (
      <div style={{ padding: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          Quay lại
        </Button>
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
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const channels = (tollplaza.channel_codes ?? []).map((code, i) => ({
    key: `${code}-${i}`,
    code,
    name: tollplaza.channel_names?.[i] || "N/A",
  }));

  return (
    <div>
      {/* Nút quay lại */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, borderRadius: 8 }}
      >
        Quay lại danh sách
      </Button>

      {/* ===== HERO HEADER ===== */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          border: "1.5px solid #93c5fd",
        }}
        styles={{ body: { padding: "24px 28px" } }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
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
            <ApartmentOutlined />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
              {tollplaza.name}
            </Title>
            <Space size={8} style={{ marginTop: 6 }}>
              <Tag color={tollplaza.status === 1 ? "success" : "default"} style={{ fontSize: 12 }}>
                {tollplaza.status === 1 ? "✓ Hoạt động" : "Ngừng hoạt động"}
              </Tag>
              {tollplaza.type_name && (
                <Tag color="blue" style={{ fontSize: 12 }}>{tollplaza.type_name}</Tag>
              )}
              {tollplaza.project_name && (
                <Tag color="geekblue" style={{ fontSize: 12 }}>{tollplaza.project_name}</Tag>
              )}
            </Space>
          </div>
        </div>

        {tollplaza.description && (
          <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 14 }}>
            {tollplaza.description}
          </Text>
        )}

        <Divider style={{ margin: "0 0 14px" }} />

        <Row gutter={32}>
          <Col>
            <Space>
              <CarOutlined style={{ color: "#1677ff" }} />
              <Text style={{ fontSize: 13 }}>
                <strong>{tollplaza.lanes ?? 0}</strong> làn
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <WifiOutlined style={{ color: "#0e9488" }} />
              <Text style={{ fontSize: 13 }}>
                <strong>{channels.length}</strong> kênh truyền
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <TeamOutlined style={{ color: "#7c3aed" }} />
              <Text style={{ fontSize: 13 }}>
                <strong>{contacts.length}</strong> liên hệ
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <CalendarOutlined style={{ color: "#999" }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Tạo: {formatDate(tollplaza.created_at)}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <CalendarOutlined style={{ color: "#999" }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Cập nhật: {formatDate(tollplaza.updated_at)}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ===== THÔNG TIN CHI TIẾT — dạng grid card ===== */}
      <Card
        title={
          <Space>
            <InfoCircleOutlined style={{ color: "#1677ff" }} />
            <span>Thông tin chi tiết</span>
          </Space>
        }
        style={{ borderRadius: 12, marginBottom: 20 }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <InfoItem
              icon={<ProjectOutlined />}
              label="Dự án"
              value={tollplaza.project_name || <Text type="secondary">—</Text>}
              color="#1677ff"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <InfoItem
              icon={<ApartmentOutlined />}
              label="Loại trạm"
              value={tollplaza.type_name || <Text type="secondary">—</Text>}
              color="#0e9488"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <InfoItem
              icon={<CarOutlined />}
              label="Số làn"
              value={
                tollplaza.lanes
                  ? <Badge count={tollplaza.lanes} overflowCount={999} color="#ea580c" showZero style={{ fontSize: 12 }} />
                  : <Text type="secondary">—</Text>
              }
              color="#ea580c"
            />
          </Col>
          {tollplaza.address && (
            <Col xs={24} sm={24} md={16}>
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Địa chỉ"
                value={tollplaza.address}
                color="#7c3aed"
              />
            </Col>
          )}
          {tollplaza.lat && tollplaza.lng && (
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Tọa độ"
                value={
                  <Text style={{ fontSize: 12, fontFamily: "monospace" }}>
                    {Number(tollplaza.lat).toFixed(5)}, {Number(tollplaza.lng).toFixed(5)}
                  </Text>
                }
                color="#059669"
              />
            </Col>
          )}
        </Row>
      </Card>

      {/* ===== KÊNH TRUYỀN ===== */}
      {channels.length > 0 && (
        <Card
          title={
            <Space>
              <WifiOutlined style={{ color: "#0e9488" }} />
              <span>Kênh truyền</span>
              <Tag color="cyan">{channels.length} kênh</Tag>
            </Space>
          }
          style={{ borderRadius: 12, marginBottom: 20 }}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "16px 20px" }}>
            {channels.map((ch) => (
              <div
                key={ch.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 18px",
                  background: "#f0fdf4",
                  borderRadius: 10,
                  border: "1.5px solid #86efac",
                  minWidth: 110,
                }}
              >
                <WifiOutlined style={{ color: "#059669", fontSize: 18 }} />
                <Text strong style={{ fontSize: 13, color: "#059669" }}>{ch.name}</Text>
                <Tag color="orange" style={{ margin: 0, fontSize: 11 }}>{ch.code}</Tag>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ===== DANH SÁCH LIÊN HỆ ===== */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Danh sách liên hệ</span>
            <Tag color="blue">{contacts.length} người</Tag>
          </Space>
        }
        extra={
          contacts.length > 0 && (
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
          )
        }
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
      >
        {contacts.length === 0 ? (
          <div style={{ padding: 32 }}>
            <Empty description="Chưa có liên hệ nào thuộc trạm này" />
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
            scroll={{ x: 600 }}
            rowClassName={() => "toll-contact-row"}
            columns={[
              {
                title: "Họ tên",
                dataIndex: "fullname",
                sorter: (a: Contact, b: Contact) =>
                  (a.fullname ?? "").localeCompare(b.fullname ?? ""),
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
                width: 160,
                ellipsis: true,
                render: (v: string) =>
                  v ? <Text style={{ fontSize: 13 }}>{v}</Text> : <Text type="secondary">—</Text>,
              },
            ]}
          />
        )}
      </Card>

      <style>{`
        .toll-contact-row:hover td { background: #eff6ff !important; }
        .ant-table-thead > tr > th { background: #fafafa !important; font-weight: 600; font-size: 13px; }
        .ant-pagination { padding: 12px 16px; }
      `}</style>
    </div>
  );
}
