import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import { getOffice } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Office {
  id: number;
  name: string;
  description?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export default function Office() {
  const [data, setData] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const navigate = useNavigate();

  const fetchData = async (keyword = "") => {
    setLoading(true);

    try {
      const res = await getOffice(keyword);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  const columns = [
    {
      title: "Phòng ban",
      dataIndex: "name",
    },
  ];

  return (
    <Card title="Danh sách phòng ban" style={{ margin: "16px" }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/office/${record.id}`);
          },
        })}
      />
    </Card>
  );
}
