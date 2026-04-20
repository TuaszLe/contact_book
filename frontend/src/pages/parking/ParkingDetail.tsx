import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Descriptions, Tag, Spin, Empty } from "antd";
import { getParkingDetail } from "../../services/api";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

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

export default function ParkingDetail() {
  const { id } = useParams();

  const [parking, setParking] = useState<Parking | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getParkingDetail(Number(id));
        setParking(data.parking);
        setContacts(data.contacts || []);
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

  if (error || !parking) {
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
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#1890ff" }}>
          {parking.name}
        </h1>
      </Card>

      {/* Thông tin cơ bản */}
      <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Nhà Thầu" span={1}>
            <Tag color="blue">{parking.contractor_name || "N/A"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Loại Bãi Đỗ" span={1}>
            <Tag color="cyan">{parking.type_name || "N/A"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số Làn" span={1}>
            <Tag color="volcano">{parking.lanes}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái" span={1}>
            <Tag color={parking.status === 1 ? "green" : "red"}>
              {parking.status === 1 ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Địa Chỉ" span={2}>
            {parking.address || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô Tả" span={2}>
            {parking.description || "Không có mô tả"}
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
                dataIndex: "name",
                key: "name",
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
            {new Date(parking.created_at || "").toLocaleDateString(
              "vi-VN"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Cập Nhật Cuối">
            {new Date(parking.updated_at || "").toLocaleDateString(
              "vi-VN"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

}