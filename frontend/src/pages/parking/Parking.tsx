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

type FilterType = "all" | "bãi kín" | "bãi mở";

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

  // Lọc data theo type
  const filteredData = data.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type_name?.toLowerCase() === activeFilter;
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
            type={activeFilter === "bãi kín" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "bãi kín" ? "#7c3aed" : undefined,
              borderColor: activeFilter === "bãi kín" ? "#7c3aed" : undefined,
              color: activeFilter === "bãi kín" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "bãi kín" ? "all" : "bãi kín")
            }
          >
            Bãi kín
          </Button>
          <Button
            type={activeFilter === "bãi mở" ? "primary" : "default"}
            style={{
              backgroundColor: activeFilter === "bãi mở" ? "#ea580c" : undefined,
              borderColor: activeFilter === "bãi mở" ? "#ea580c" : undefined,
              color: activeFilter === "bãi mở" ? "white" : undefined,
            }}
            onClick={() =>
              setActiveFilter(activeFilter === "bãi mở" ? "all" : "bãi mở")
            }
          >
            Bãi mở
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
