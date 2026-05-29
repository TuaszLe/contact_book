import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Descriptions, Spin, Empty } from "antd";
import { getContractorDetail } from "../../services/api";
interface Contact {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  title_name: string;
}

interface Contractor {
  id: number;
  name: string;
  description?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export default function ContractorDetail() {
  const { id } = useParams();

  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContractorDetail(Number(id));
        setContractor(data.contractor);
        setContacts(data.contacts);
        setError(null);
      } catch {
        setError("Không thể tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" description="Đang tải..." />
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div style={{ padding: "24px" }}>
        <Empty description={error || "Không tìm thấy dữ liệu"} />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card style={{ marginBottom: 24, backgroundColor: "#fafafa" }}>
        <h1
          style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#1890ff" }}
        >
          {contractor.name}
        </h1>
      </Card>

      {/* Thông tin cơ bản */}
      <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Mô Tả" span={2}>
            {contractor.description || "Không có mô tả"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      {/* Danh sách liên hệ */}
      <Card title="Danh Sách Liên Hệ" style={{ marginBottom: 24 }}>
        {contacts.length > 0 ? (
          <Table
            rowKey="id"
            columns={[
              {
                title: "Họ Tên",
                dataIndex: "fullname",
                key: "fullname",
                width: "30%",
              },
              {
                title: "Điện Thoại",
                dataIndex: "phone",
                key: "phone",
                width: "35%",
                render: (text) =>
                  text ? <a href={`tel:${text}`}>{text}</a> : "N/A",
              },
              {
                title: "Email",
                dataIndex: "email",
                key: "email",
                width: "35%",
                render: (text) =>
                  text ? <a href={`mailto:${text}`}>{text}</a> : "N/A",
              },
              {
                title: "Chức Vụ",
                dataIndex: "title_name",
                key: "title_name",
                width: "30%",
              },
            ]}
            dataSource={contacts}
            pagination={{ pageSize: 10 }}
            bordered
          />
        ) : (
          <Empty description="Chưa có liên hệ nào" />
        )}
      </Card>

      {/* Metadata */}
      <Card size="small" style={{ backgroundColor: "#f0f2f5" }}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Ngày Tạo">
            {new Date(contractor.created_at || "").toLocaleDateString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Cập Nhật Cuối">
            {new Date(contractor.updated_at || "").toLocaleDateString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
