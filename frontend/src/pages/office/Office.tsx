import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Input,
  Typography,
  Space,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Badge,
} from "antd";
import {
  SearchOutlined,
  BankOutlined,
  TeamOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getOffice } from "../../services/api";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

interface Office {
  id: number;
  name: string;
  description?: string;
  status?: number;
  contact_count?: number;
  created_at?: string;
  updated_at?: string;
}

export default function Office() {
  const [data, setData] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getOffice();
        setData(res ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((o) =>
      o.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>
          <BankOutlined style={{ marginRight: 8 }} />
          Danh sách văn phòng
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Tổng cộng <strong>{data.length}</strong> văn phòng
          {search && (
            <> — đang hiển thị <strong style={{ color: "#1677ff" }}>{filtered.length}</strong> kết quả</>
          )}
        </Text>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, maxWidth: 360 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          placeholder="Tìm theo tên văn phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : filtered.length === 0 ? (
        <Empty description="Không tìm thấy văn phòng nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((office) => (
            <Col xs={24} sm={12} md={8} lg={6} key={office.id}>
              <Card
                hoverable
                onClick={() => navigate(`/office/${office.id}`)}
                style={{
                  borderRadius: 12,
                  border: "1.5px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                styles={{ body: { padding: "18px 20px" } }}
              >
                {/* Icon + tên */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: "#e6f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: "#1677ff",
                      flexShrink: 0,
                    }}
                  >
                    <BankOutlined />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Text
                      strong
                      style={{ fontSize: 14, display: "block", lineHeight: 1.4 }}
                      ellipsis={{ tooltip: office.name }}
                    >
                      {office.name}
                    </Text>
                    {office.description && (
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, display: "block", marginTop: 2 }}
                        ellipsis={{ tooltip: office.description }}
                      >
                        {office.description}
                      </Text>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #f5f5f5",
                    paddingTop: 10,
                    marginTop: 4,
                  }}
                >
                  <Space size={4}>
                    <TeamOutlined style={{ color: "#999", fontSize: 13 }} />
                    {office.contact_count != null ? (
                      <Badge
                        count={office.contact_count}
                        overflowCount={999}
                        style={{ backgroundColor: "#1677ff", fontSize: 11 }}
                        showZero
                      />
                    ) : (
                      <Tag style={{ fontSize: 11, margin: 0 }}>Xem chi tiết</Tag>
                    )}
                  </Space>
                  <RightOutlined style={{ color: "#ccc", fontSize: 11 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
