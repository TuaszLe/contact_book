import { useEffect, useState } from "react";
import { Table, Card, Button, Space } from "antd";
import { getParking } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Parking {
  id: number;
  name: string;
  description?: string;
  address?: string;
  contractor?: number;
  contractor_name?: string;
  type?: number;
  type_name?: string;
  lanes?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

type FilterType = "all" | "kín" | "mở" | "acv";

export default function Parking() {
  const [data, setData] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const navigate = useNavigate();

  const fetchData = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await getParking(keyword);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  // Lọc data theo type_name trả về từ API: "kín" hoặc "mở"
  const filteredData = data.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type_name?.toLowerCase().trim() === activeFilter;
  });

  const columns = [
    {
      title: "Parking Name",
      dataIndex: "name",
    },
    {
      title: "Contractor",
      dataIndex: "contractor_name",
    },
    {
      title: "Type",
      dataIndex: "type_name",
    },
  ];

  return (
    <Card
      title="Danh sách Parking"
      extra={
        <Space>
          <Button
            type={activeFilter === "all" ? "primary" : "default"}
            onClick={() => setActiveFilter("all")}
          >
            Tất cả
          </Button>
          <Button
            type={activeFilter === "kín" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "kín" ? "#7c3aed" : undefined,
              borderColor: activeFilter === "kín" ? "#7c3aed" : undefined,
              color: activeFilter === "kín" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "kín" ? "all" : "kín")
            }
          >
            Bãi kín
          </Button>
          <Button
            type={activeFilter === "mở" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "mở" ? "#ea580c" : undefined,
              borderColor: activeFilter === "mở" ? "#ea580c" : undefined,
              color: activeFilter === "mở" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "mở" ? "all" : "mở")
            }
          >
            Bãi mở
          </Button>
          <Button
            type={activeFilter === "acv" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "acv" ? "#059669" : undefined,
              borderColor: activeFilter === "acv" ? "#059669" : undefined,
              color: activeFilter === "acv" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "acv" ? "all" : "acv")
            }
          >
            ACV
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
            navigate(`/parking/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </Card>
  );
}
