import { useEffect, useState } from "react";
import { Table, Card } from "antd";
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

export default function Tollplaza() {

  const [data, setData] = useState<Tollplaza[]>([]);
  const [loading, setLoading] = useState(false);

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

  const columns = [

    {
      title: "TollPlaza",
      dataIndex: "name"
    },

    {
      title: "Project",
      dataIndex: "project_name"
    },

    {
      title: "Type",
      dataIndex: "type_name"
    },
    {
      title: "Channel",
      dataIndex: "channel_name"
    },
    {
      title: "Channel Code",
      dataIndex: "channel_code"
    }

  ];

  return (

    <Card title="Danh sách TollPlaza">

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
        onClick: () => {
        navigate(`/tollplaza/${record.id}`);
        }
    })}
      />

    </Card>

  );

}