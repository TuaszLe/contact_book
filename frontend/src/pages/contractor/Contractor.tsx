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
  ToolOutlined,
  TeamOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getContractor } from "../../services/api";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

interface Contractor {
  id: number;
  name: string;
  description?: string;
  status?: number;
  contact_count?: number;
  created_at?: string;
  updated_at?: string;
}

export default function Contractor() {
  const [data, setData] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getContractor();
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
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>
          <ToolOutlined style={{ marginRight: 8 }} />
          Danh sách nhà thầu
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Tổng cộng <strong>{data.length}</strong> nhà thầu
          {search && (
            <> — đang hiển thị <strong style={{ color: "#059669" }}>{filtered.length}</strong> kết quả</>
          )}
        </Text>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, maxWidth: 360 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          placeholder="Tìm theo tên hoặc mô tả..."
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
        <Empty description="Không tìm thấy nhà thầu nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                onClick={() => navigate(`/contractor/${item.id}`)}
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
                      background: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: "#059669",
                      flexShrink: 0,
                    }}
                  >
                    <ToolOutlined />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Text
                      strong
                      style={{ fontSize: 14, display: "block", lineHeight: 1.4 }}
                      ellipsis={{ tooltip: item.name }}
                    >
                      {item.name}
                    </Text>
                    {item.description ? (
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, display: "block", marginTop: 2 }}
                        ellipsis={{ tooltip: item.description }}
                      >
                        {item.description}
                      </Text>
                    ) : (
                      <Text type="secondary" style={{ fontSize: 12 }}>Chưa có mô tả</Text>
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
                    {item.contact_count != null ? (
                      <Badge
                        count={item.contact_count}
                        overflowCount={999}
                        style={{ backgroundColor: "#059669", fontSize: 11 }}
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
