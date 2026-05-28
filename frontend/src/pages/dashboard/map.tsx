import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// FIX icon marker bị mất
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
            icon={customIcon}
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