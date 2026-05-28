import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom SVG dot icon — nhỏ gọn, màu teal, viền trắng, có bóng đổ
const svgIcon = L.divIcon({
  className: "",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="7" fill="#0e9488" stroke="white" stroke-width="2.5"/>
      <circle cx="9" cy="9" r="3" fill="white" opacity="0.6"/>
    </svg>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  tooltipAnchor: [10, 0],
});

interface Props {
  data: {
    id: number;
    name: string;
    lat?: number;
    lng?: number;
    project_name?: string;
    lanes?: number;
  }[];
  height?: number;
}

export default function MapView({ data }: Props) {
  const center: [number, number] = [16, 108];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      />

      {data.map((item) =>
        item.lat && item.lng ? (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={svgIcon}
          >
            <Tooltip>
              <div>
                <b>{item.name}</b><br />
                {item.project_name && <>Dự án: {item.project_name}<br /></>}
                {item.lanes && <>Làn: {item.lanes}</>}
              </div>
            </Tooltip>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
