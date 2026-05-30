import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Typography, Tag, Divider } from "antd";
import {
  EnvironmentOutlined,
  CarOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// Custom SVG dot icon — teal, viền trắng, bóng đổ, hiệu ứng pulse
const svgIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px;cursor:pointer">
      <div style="
        position:absolute;inset:0;
        border-radius:50%;
        background:rgba(14,148,136,0.25);
        animation:pulse 2s ease-out infinite;
      "></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" style="position:relative;z-index:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
        <circle cx="11" cy="11" r="8" fill="#0e9488" stroke="white" stroke-width="2.5"/>
        <circle cx="11" cy="11" r="3.5" fill="white" opacity="0.85"/>
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0%   { transform: scale(1); opacity: 0.6; }
        70%  { transform: scale(2.2); opacity: 0; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

interface StationData {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
  project_name?: string;
  contractor_name?: string;
  type_name?: string;
  lanes?: number;
  status?: number;
}

interface Props {
  data: StationData[];
  height?: number;
}

function StationPopup({ item }: { item: StationData }) {
  return (
    <div style={{ minWidth: 220, fontFamily: "inherit" }}>
      {/* Tiêu đề */}
      <div
        style={{
          background: "linear-gradient(135deg, #0e9488 0%, #0891b2 100%)",
          margin: "-12px -16px 0",
          padding: "12px 16px 10px",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <Text
          strong
          style={{ color: "#fff", fontSize: 14, display: "block", lineHeight: 1.3 }}
        >
          {item.name}
        </Text>
        {item.type_name && (
          <Tag
            style={{
              marginTop: 5,
              fontSize: 11,
              padding: "0 7px",
              lineHeight: "18px",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
            }}
          >
            {item.type_name}
          </Tag>
        )}
      </div>

      <div style={{ padding: "10px 4px 0" }}>
        {item.project_name && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <ProjectOutlined style={{ color: "#1677ff", fontSize: 13, flexShrink: 0 }} />
            <Text style={{ fontSize: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Dự án: </Text>
              {item.project_name}
            </Text>
          </div>
        )}

        {item.contractor_name && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <InfoCircleOutlined style={{ color: "#7c3aed", fontSize: 13, flexShrink: 0 }} />
            <Text style={{ fontSize: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Nhà thầu: </Text>
              {item.contractor_name}
            </Text>
          </div>
        )}

        {(item.lanes ?? 0) > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <CarOutlined style={{ color: "#ea580c", fontSize: 13, flexShrink: 0 }} />
            <Text style={{ fontSize: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Số làn: </Text>
              <Text strong>{item.lanes}</Text> làn
            </Text>
          </div>
        )}

        {item.lat && item.lng && (
          <>
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <EnvironmentOutlined style={{ color: "#0e9488", fontSize: 13, flexShrink: 0 }} />
              <Text type="secondary" style={{ fontSize: 11 }}>
                {Number(item.lat).toFixed(5)}, {Number(item.lng).toFixed(5)}
              </Text>
            </div>
          </>
        )}

        {item.status != null && (
          <div style={{ marginTop: 8 }}>
            <Tag color={item.status === 1 ? "success" : "default"} style={{ fontSize: 11 }}>
              {item.status === 1 ? "Hoạt động" : "Ngừng hoạt động"}
            </Tag>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapView({ data, height = 520 }: Props) {
  // Center dọc theo Việt Nam: trung điểm kinh tuyến ~107.5°E, vĩ tuyến ~16.5°N
  // zoom=5.6 hiển thị toàn dải từ Lạng Sơn (23°N) → Cà Mau (8.5°N)
  const center: [number, number] = [16.5, 107.5];

  return (
    <MapContainer
      center={center}
      zoom={5.6}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      />

      {data.map((item) =>
        item.lat && item.lng && !isNaN(Number(item.lat)) && !isNaN(Number(item.lng)) ? (
          <Marker
            key={item.id}
            position={[Number(item.lat), Number(item.lng)]}
            icon={svgIcon}
          >
            <Popup
              minWidth={240}
              maxWidth={300}
              className="station-popup"
            >
              <StationPopup item={item} />
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
