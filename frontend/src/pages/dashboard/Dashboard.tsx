import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Empty,
  Tabs,
  Progress,
  Tag,
  Table,
  Typography,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  ApartmentOutlined,
  ProjectOutlined,
  CarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { getParking, getTollplaza } from "../../services/api";
import MapView from "./map";

const { Text, Title } = Typography;

interface SummaryItem {
  id: number;
  name: string;
  contractor_name?: string;
  type_name?: string;
  project_name?: string;
  lanes?: number;
  lat?: number;
  lng?: number;
  status?: number;
}

interface GroupSummary {
  key: string;
  count: number;
  totalLanes: number;
}

// ---- KPI Card ----
function KpiCard({
  title,
  value,
  icon,
  color,
  suffix,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}) {
  return (
    <Card
      style={{
        borderRadius: 12,
        border: `1.5px solid ${color}22`,
        background: `linear-gradient(135deg, ${color}12 0%, #fff 100%)`,
      }}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Text>
          <div
            style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, color }}
          >
            {value.toLocaleString()}
            {suffix && (
              <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>
                {suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ---- Group Progress List ----
function GroupProgressList({
  title,
  groups,
  color,
  unit = "trạm",
}: {
  title: string;
  groups: GroupSummary[];
  color: string;
  unit?: string;
}) {
  const max = Math.max(...groups.map((g) => g.count), 1);
  return (
    <Card
      title={
        <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
      }
      style={{ borderRadius: 12, height: "100%" }}
      styles={{ body: { padding: "12px 20px" } }}
    >
      {groups.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        groups
          .sort((a, b) => b.count - a.count)
          .map((g) => (
            <div key={g.key} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 13 }} ellipsis={{ tooltip: g.key }}>
                  {g.key}
                </Text>
                <Tag color={color} style={{ fontWeight: 600, fontSize: 12 }}>
                  {g.count} {unit}
                </Tag>
              </div>
              <Progress
                percent={Math.round((g.count / max) * 100)}
                showInfo={false}
                strokeColor={color}
                trailColor="#f0f0f0"
                size="small"
              />
            </div>
          ))
      )}
    </Card>
  );
}

export default function Dashboard() {
  const [tollplazas, setTollplazas] = useState<SummaryItem[]>([]);
  const [parkings, setParkings] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupBy = (
    items: SummaryItem[],
    keyFn: (item: SummaryItem) => string
  ): GroupSummary[] => {
    const map: Record<string, GroupSummary> = {};
    items.forEach((item) => {
      const key = keyFn(item) || "Không xác định";
      if (!map[key]) map[key] = { key, count: 0, totalLanes: 0 };
      map[key].count += 1;
      map[key].totalLanes += item.lanes ?? 0;
    });
    return Object.values(map);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [tData, pData] = await Promise.all([
          getTollplaza(),
          getParking(),
        ]);
        setTollplazas(tData ?? []);
        setParkings(pData ?? []);
        setError(null);
      } catch {
        setError("Không thể tải dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const tollplazaByType = groupBy(tollplazas, (i) => i.type_name || "");
  const tollplazaByProject = groupBy(tollplazas, (i) => i.project_name || "");
  const parkingByContractor = groupBy(parkings, (i) => i.contractor_name || "");
  const parkingByType = groupBy(parkings, (i) => i.type_name || "");
  const totalTollLanes = tollplazas.reduce((s, i) => s + (i.lanes ?? 0), 0);
  const withCoords = tollplazas.filter(
    (i) => i.lat && i.lng && !isNaN(Number(i.lat)) && !isNaN(Number(i.lng))
  ).length;

  const topToll = [...tollplazas]
    .filter((i) => (i.lanes ?? 0) > 0)
    .sort((a, b) => (b.lanes ?? 0) - (a.lanes ?? 0))
    .slice(0, 6);

  const topParkingCols = [
    {
      title: "Tên bãi",
      dataIndex: "name",
      ellipsis: true,
      render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: "Loại",
      dataIndex: "type_name",
      width: 90,
      render: (v: string) => (
        <Tag color={v?.toLowerCase() === "mở" ? "orange" : "purple"}>
          {v || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Nhà thầu",
      dataIndex: "contractor_name",
      ellipsis: true,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v || "N/A"}
        </Text>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <Spin size="large" tip="Đang tải dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description={error} />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 4px" }}>
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>
          📊 Tổng quan hệ thống
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Dữ liệu thời gian thực từ API
        </Text>
      </div>

      <Tabs
        defaultActiveKey="toll"
        size="large"
        items={[
          // ================= TOLL =================
          {
            key: "toll",
            label: <span>🚧 Trạm thu phí</span>,
            children: (
              <div>
                {/* KPI Row */}
                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                  <Col xs={12} sm={6}>
                    <KpiCard
                      title="Tổng trạm"
                      value={tollplazas.length}
                      icon={<ApartmentOutlined />}
                      color="#1677ff"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <KpiCard
                      title="Tổng làn"
                      value={totalTollLanes}
                      icon={<CarOutlined />}
                      color="#0e9488"
                      suffix="làn"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <KpiCard
                      title="Có tọa độ"
                      value={withCoords}
                      icon={<EnvironmentOutlined />}
                      color="#7c3aed"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <KpiCard
                      title="Dự án"
                      value={tollplazaByProject.length}
                      icon={<ProjectOutlined />}
                      color="#ea580c"
                    />
                  </Col>
                </Row>

                {/* Bố cục: Bản đồ dọc bên trái, thông tin bên phải */}
                <Row gutter={[16, 16]}>
                  {/* Bản đồ — cao hơn, dọc theo hình Việt Nam */}
                  <Col xs={24} lg={14}>
                    <Card
                      title={
                        <span>
                          <EnvironmentOutlined style={{ marginRight: 6 }} />
                          Vị trí trạm trên bản đồ
                          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8, fontWeight: 400 }}>
                            (click vào nút tròn để xem chi tiết)
                          </Text>
                        </span>
                      }
                      style={{ borderRadius: 12 }}
                      styles={{
                        body: {
                          padding: 0,
                          overflow: "hidden",
                          borderRadius: "0 0 12px 12px",
                        },
                      }}
                    >
                      {/* height 520px — đủ để hiển thị dọc Việt Nam từ Lạng Sơn → Cà Mau */}
                      <div style={{ height: 520 }}>
                        <MapView data={tollplazas} height={520} />
                      </div>
                    </Card>
                  </Col>

                  {/* Right: Theo loại + Theo dự án */}
                  <Col xs={24} lg={10}>
                    <Row gutter={[0, 16]}>
                      <Col span={24}>
                        <GroupProgressList
                          title="🔗 Phân loại trạm"
                          groups={tollplazaByType}
                          color="#0e9488"
                        />
                      </Col>
                      <Col span={24}>
                        <GroupProgressList
                          title="📁 Theo dự án"
                          groups={tollplazaByProject}
                          color="#1677ff"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Top trạm nhiều làn */}
                {topToll.length > 0 && (
                  <>
                    <Divider style={{ margin: "20px 0 16px" }} />
                    <Card
                      title={<span>🏆 Top trạm nhiều làn nhất</span>}
                      style={{ borderRadius: 12 }}
                    >
                      <Row gutter={[12, 12]}>
                        {topToll.map((item, idx) => (
                          <Col xs={24} sm={12} md={8} key={item.id}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 14px",
                                background:
                                  idx === 0
                                    ? "#fff7e6"
                                    : idx === 1
                                    ? "#f6ffed"
                                    : "#fafafa",
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                            >
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  background:
                                    idx === 0
                                      ? "#fa8c16"
                                      : idx === 1
                                      ? "#52c41a"
                                      : "#d9d9d9",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: 13,
                                  flexShrink: 0,
                                }}
                              >
                                {idx + 1}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                  }}
                                  ellipsis={{ tooltip: item.name }}
                                >
                                  {item.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {item.lanes} làn
                                  {item.project_name && ` • ${item.project_name}`}
                                </Text>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </>
                )}
              </div>
            ),
          },

          // ================= PARKING =================
          {
            key: "parking",
            label: <span>🅿️ Bãi đỗ xe</span>,
            children: (
              <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                  <Col xs={12} sm={8}>
                    <KpiCard
                      title="Tổng bãi"
                      value={parkings.length}
                      icon={<AppstoreOutlined />}
                      color="#f5576c"
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <KpiCard
                      title="Bãi mở"
                      value={
                        parkings.filter(
                          (i) => i.type_name?.toLowerCase().trim() === "mở"
                        ).length
                      }
                      icon={<span style={{ fontSize: 18 }}>🌅</span>}
                      color="#ea580c"
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <KpiCard
                      title="Bãi kín"
                      value={
                        parkings.filter(
                          (i) => i.type_name?.toLowerCase().trim() === "kín"
                        ).length
                      }
                      icon={<span style={{ fontSize: 18 }}>🏚️</span>}
                      color="#7c3aed"
                    />
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={10}>
                    <Row gutter={[0, 16]}>
                      <Col span={24}>
                        <GroupProgressList
                          title="🏢 Theo nhà thầu"
                          groups={parkingByContractor}
                          color="#f5576c"
                          unit="bãi"
                        />
                      </Col>
                      <Col span={24}>
                        <GroupProgressList
                          title="🔗 Phân loại bãi"
                          groups={parkingByType}
                          color="#7c3aed"
                          unit="bãi"
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24} lg={14}>
                    <Card
                      title="📍 Danh sách bãi đỗ"
                      style={{ borderRadius: 12 }}
                      styles={{ body: { padding: "0 0 8px" } }}
                    >
                      <Table
                        rowKey="id"
                        columns={topParkingCols}
                        dataSource={parkings}
                        pagination={{ pageSize: 8, size: "small" }}
                        size="small"
                        style={{ fontSize: 13 }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
