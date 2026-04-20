import { useEffect, useState } from "react";
import { Table, Card } from "antd";
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

export default function Parking() {

  const [data, setData] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(false);

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

  const columns = [

    {
      title: "Parking Name",
      dataIndex: "name"
    },

    {
      title: "Contractor",
      dataIndex: "contractor_name"
    },

    {
      title: "Type",
      dataIndex: "type_name"
    }

  ];

  return (

    <Card title="Danh sách Parking">

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
        onClick: () => {
        navigate(`/parking/${record.id}`);
        }
    })}
      />

    </Card>

  );

}