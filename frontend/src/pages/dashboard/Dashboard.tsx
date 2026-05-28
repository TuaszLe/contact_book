import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, Empty, Tabs } from "antd";
import { getParking, getTollplaza } from "../../services/api";
import { HomeOutlined } from "@ant-design/icons";
import MapView from "./map";

interface SummaryItem {
  id: number;
  name: string;
  contractor_name?: string;
  type_name?: string;
  project_name?: string;
  lanes?: number;
  lat?: number;
  lng?: number;
}

interface GroupSummary {
  key: string;
  count: number;
  totalLanes: number;
}

export default function Dashboard() {
  const [tollplazas, setTollplazas] = useState<SummaryItem[]>([]);
  const [parkings, setParkings] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== GROUP =====
  const groupBy = (
    items: SummaryItem[],
    keyFn: (item: SummaryItem) => string,
  ): GroupSummary[] => {
    const map: Record<string, GroupSummary> = {};

    items.forEach((item) => {
      const key = keyFn(item) || "Unknown";
      const lanes = item.lanes ?? 0;

      if (!map[key]) {
        map[key] = { key, count: 0, totalLanes: 0 };
      }

      map[key].count += 1;
      map[key].totalLanes += lanes;
    });

    return Object.values(map);
  };

  // ===== FETCH =====
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const tData = await getTollplaza();
        const pData = await getParking();

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

  // ===== DATA =====
  const tollplazaByType = groupBy(tollplazas, (i) => i.type_name || "Unknown");
  const tollplazaByProject = groupBy(
    tollplazas,
    (i) => i.project_name || "Unknown",
  );

  const parkingByContractor = groupBy(
    parkings,
    (i) => i.contractor_name || "Unknown",
  );
  const parkingByType = groupBy(parkings, (i) => i.type_name || "Unknown");

  const totalTollplazaLanes = tollplazas.reduce(
    (sum, item) => sum + (item.lanes ?? 0),
    0,
  );

  const top5tollplazas = tollplazas
    .sort((a, b) => (b.lanes ?? 0) - (a.lanes ?? 0))
    .slice(0, 5);
  const top5parkings = parkings
    .sort((a, b) => (b.lanes ?? 0) - (a.lanes ?? 0))
    .slice(0, 5);

  // ===== LOADING =====
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
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
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 20 }}>
        <HomeOutlined /> Dashboard
      </h1>

      <Tabs
        defaultActiveKey="toll"
        items={[
          // ================= TOLL =================
          {
            key: "toll",
            label: "🚧 Trạm thu phí",
            children: (
              <Row gutter={16} align="stretch">
                {/* MAP */}
                <Col xs={24} lg={12}>
                  <Card
                    style={{ height: "100%" }}
                    styles={{ body: { height: "100%", padding: 0 } }}
                  >
                    <MapView data={tollplazas} />
                  </Card>
                </Col>

                {/* INFO */}
                <Col xs={24} lg={12}>
                  <div>
                    {/* METRIC */}
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={12}>
                        <Card
                          style={{
                            background:
                              "linear-gradient(135deg,#667eea,#764ba2)",
                          }}
                        >
                          <Statistic
                            title="Số Trạm"
                            value={tollplazas.length}
                            styles={{ content: { color: "#fff" } }}
                          />
                        </Card>
                      </Col>

                      <Col span={12}>
                        <Card
                          style={{
                            background:
                              "linear-gradient(135deg,#4facfe,#00f2fe)",
                          }}
                        >
                          <Statistic
                            title="Tổng Làn"
                            value={totalTollplazaLanes}
                            styles={{ content: { color: "#fff" } }}
                          />
                        </Card>
                      </Col>
                    </Row>

                    {/* TOP */}
                    <Card title="Top 5 Trạm" style={{ marginBottom: 16 }}>
                      {top5tollplazas.slice(0, 5).map((i) => (
                        <p key={i.id}>
                          <b>{i.name}</b> ({i.lanes} làn)
                        </p>
                      ))}
                    </Card>

                    {/* PROJECT */}
                    <Card title="Theo dự án" style={{ marginBottom: 16 }}>
                      {tollplazaByProject.map((i) => (
                        <p key={i.key}>
                          <b>{i.key}</b>: {i.count} trạm
                        </p>
                      ))}
                    </Card>

                    {/* TYPE */}
                    <Card title="Theo loại">
                      {tollplazaByType.map((i) => (
                        <p key={i.key}>
                          <b>{i.key}</b>: {i.count} trạm
                        </p>
                      ))}
                    </Card>
                  </div>
                </Col>
              </Row>
            ),
          },

          // ================= PARKING =================
          {
            key: "parking",
            label: "🅿️ Bãi đỗ",
            children: (
              <Row gutter={16} align="stretch">
                {/* INFO */}
                <Col xs={24} lg={24}>
                  <div style={{ height: "100%" }}>
                    <Card
                      style={{
                        background: "linear-gradient(135deg,#f093fb,#f5576c)",
                        marginBottom: 16,
                      }}
                    >
                      <Statistic
                        title="Số Bãi Đỗ"
                        value={parkings.length}
                        styles={{ content: { color: "#fff" } }}
                      />
                    </Card>

                    <Card title="Top 5" style={{ marginBottom: 16 }}>
                      {top5parkings.slice(0, 5).map((i) => (
                        <p key={i.id}>
                          <b>{i.name}</b>
                        </p>
                      ))}
                    </Card>

                    <Card title="Theo nhà thầu" style={{ marginBottom: 16 }}>
                      {parkingByContractor.map((i) => (
                        <p key={i.key}>
                          <b>{i.key}</b>: {i.count}
                        </p>
                      ))}
                    </Card>

                    <Card title="Theo loại">
                      {parkingByType.map((i) => (
                        <p key={i.key}>
                          <b>{i.key}</b>: {i.count}
                        </p>
                      ))}
                    </Card>
                  </div>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
}
