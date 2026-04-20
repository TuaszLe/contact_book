import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import { getContacts } from "../services/api";
import { useSearchParams } from "react-router-dom";

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  title_name?: string;
  department_name?: string;
  tollplazas?: Array<{ id: number; name: string }>;
}

export default function Contacts() {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const search = params.get("search") || "";

  const fetchData = async (keyword = "") => {

    setLoading(true);

    try {
      const data = await getContacts(keyword);
      setContacts(data);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {

    fetchData(search);

  }, [search]);

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "last_name+' '+first_name" 
    },
    {
      title: "Điện thoại",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Trạm thu phí",
      dataIndex: "tollplazas",
      render: (value: Contact["tollplazas"]) =>
        Array.isArray(value) ? value.map((t) => t.name).join(", ") : ""
    }

  ];

  return (

    <Card title="Danh bạ">

      <Table
        rowKey="id"
        columns={columns}
        dataSource={contacts}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

    </Card>

  );

}