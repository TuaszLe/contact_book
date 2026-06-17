import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getTollplaza } from "../../services/api";
import { Card, Tag, Button, Spin, Badge } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon bị mất do Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icon màu xanh lá cho "vận hành"
const iconVanHanh = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icon màu xanh dương cho "kết nối"
const iconKetNoi = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icon màu xám cho không xác định
const iconDefault = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Tollplaza {
  id: number;
  name: string;
  address?: string;
  project_name?: string;
  type_name?: string;
  lanes?: number;
  status?: number;
  lat?: number;
  lng?: number;
}

export default function TollplazaMap() {
  const [data, setData] = useState<Tollplaza[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTollplaza()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  // Chỉ lấy trạm có tọa độ hợp lệ
  const validData = data.filter(
    (item) =>
      item.lat && item.lng &&
      !isNaN(Number(item.lat)) &&
      !isNaN(Number(item.lng))
  );

  const getIcon = (type_name?: string) => {
    const t = type_name?.toLowerCase().trim() ?? "";
    if (t === "vận hành") return iconVanHanh;
    if (t === "kết nối") return iconKetNoi;
    return iconDefault;
  };

  const getTagColor = (type_name?: string) => {
    const t = type_name?.toLowerCase().trim() ?? "";
    if (t === "vận hành") return "green";
    if (t === "kết nối") return "blue";
    return "default";
  };

  // Tâm bản đồ mặc định: Hà Nội
  const defaultCenter: [number, number] =
    validData.length > 0
      ? [Number(validData[0].lat), Number(validData[0].lng)]
      : [21.0245, 105.8412];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      title={
        <span>
          🗺️ Bản đồ TollPlaza
          <span style={{ marginLeft: 12, fontWeight: 400, fontSize: 13, color: "#888" }}>
            {validData.length}/{data.length} trạm có tọa độ
          </span>
        </span>
      }
      extra={
        <span style={{ fontSize: 13 }}>
          <Badge color="green" text="Vận hành" style={{ marginRight: 12 }} />
          <Badge color="blue" text="Kết nối" />
        </span>
      }
      bodyStyle={{ padding: 0 }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={validData.length > 0 ? 10 : 6}
        style={{ height: "75vh", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validData.map((item) => (
          <Marker
            key={item.id}
            position={[Number(item.lat), Number(item.lng)]}
            icon={getIcon(item.type_name)}
          >
            <Popup minWidth={260}>
              <div style={{ fontFamily: "inherit" }}>
                {/* Tên trạm */}
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>
                  {item.name}
                </div>

                {/* Type + Status */}
                <div style={{ marginBottom: 6 }}>
                  <Tag color={getTagColor(item.type_name)}>
                    {item.type_name || "Không xác định"}
                  </Tag>
                  <Tag color={item.status === 1 ? "green" : "red"}>
                    {item.status === 1 ? "Hoạt động" : "Ngừng"}
                  </Tag>
                </div>

                {/* Dự án */}
                {item.project_name && (
                  <div style={{ fontSize: 13, marginBottom: 4, color: "#555" }}>
                    📁 <b>Dự án:</b> {item.project_name}
                  </div>
                )}

                {/* Địa chỉ */}
                {item.address && (
                  <div style={{ fontSize: 13, marginBottom: 4, color: "#555" }}>
                    📍 {item.address}
                  </div>
                )}

                {/* Số làn */}
                {item.lanes !== undefined && (
                  <div style={{ fontSize: 13, marginBottom: 10, color: "#555" }}>
                    🛣️ <b>Số làn:</b> {item.lanes}
                  </div>
                )}

                {/* Nút xem chi tiết */}
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() => navigate(`/tollplaza/${item.id}`)}
                >
                  Xem chi tiết →
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {validData.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
          ⚠️ Không có trạm nào có dữ liệu tọa độ (lat/lng)
        </div>
      )}
    </Card>
  );
}
