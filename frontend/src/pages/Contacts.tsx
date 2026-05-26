import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getContacts } from "../services/api";
import { useSearchParams } from "react-router-dom";

interface Contact {
  id: number;

  firstname: string;
  lastname: string;
  fullname: string;

  phone: string;
  email: string;

  title_name?: string;

  contact_type?: string;

  contact_location_name?: string;
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

  const columns: ColumnsType<Contact> = [
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },

    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Chức vụ",
      dataIndex: "title_name",
      key: "title_name",
    },

    {
      title: "Đơn vị",
      dataIndex: "contact_location_name",
      key: "contact_location_name",
    },

    {
      title: "Loại",
      dataIndex: "contact_type",
      key: "contact_type",
    },
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
