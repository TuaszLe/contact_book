import { useEffect, useState } from "react";
import { Table, Card, Button, Space } from "antd";
import { getTollplaza } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Tollplaza {
  id: number;
  name: string;
  description?: string;
  address?: string;
  project?: number;
  project_name?: string;
  type?: number;
  type_name?: string;
  lanes?: number;
  status?: number;
  channel_name?: string;
  channel_code?: string;
  created_at?: string;
  updated_at?: string;
}

type FilterType = "all" | "vận hành" | "kết nối";

export default function Tollplaza() {

  const [data, setData] = useState<Tollplaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const navigate = useNavigate();

  const fetchData = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await getTollplaza(keyword);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  // Lọc data theo type
  const filteredData = data.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type_name?.toLowerCase() === activeFilter;
  });

  const columns = [
    {
      title: "TollPlaza",
      dataIndex: "name",
    },
    {
      title: "Project",
      dataIndex: "project_name",
    },
    {
      title: "Type",
      dataIndex: "type_name",
    },
    {
      title: "Channel",
      dataIndex: "channel_name",
    },
    {
      title: "Channel Code",
      dataIndex: "channel_code",
    },
  ];

  return (
    <Card
      title="Danh sách TollPlaza"
      extra={
        <Space>
          <Button
            type={activeFilter === "all" ? "primary" : "default"}
            onClick={() => setActiveFilter("all")}
          >
            Tất cả
          </Button>
          <Button
            type={activeFilter === "vận hành" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "vận hành" ? "#0e9488" : undefined,
              borderColor: activeFilter === "vận hành" ? "#0e9488" : undefined,
              color: activeFilter === "vận hành" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "vận hành" ? "all" : "vận hành")
            }
          >
            Vận hành
          </Button>
          <Button
            type={activeFilter === "kết nối" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "kết nối" ? "#1677ff" : undefined,
              borderColor: activeFilter === "kết nối" ? "#1677ff" : undefined,
              color: activeFilter === "kết nối" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "kết nối" ? "all" : "kết nối")
            }
          >
            Kết nối
          </Button>
        </Space>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/tollplaza/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </Card>
  );
}
