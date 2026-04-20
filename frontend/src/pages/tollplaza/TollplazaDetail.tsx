import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Descriptions, Tag, Spin, Empty } from "antd";
import { getTollplazaDetail } from "../../services/api";
interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Tollplaza {
  id: number;
  name: string;
  description?: string;
  address?: string;
  project?: number;
  project_name?: string;
  type?: number;
  type_name?: string;
  channel_codes?: string[];
  channel_names?: string[];
  lanes?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export default function TollplazaDetail() {

  const { id } = useParams();

  const [tollplaza, setTollplaza] = useState<Tollplaza | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getTollplazaDetail(Number(id));
        setTollplaza(data.tollplaza);
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

  if (error || !tollplaza) {
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
          {tollplaza.name}
        </h1>
      </Card>

      {/* Thông tin cơ bản */}
      <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Dự Án" span={1}>
            <Tag color="blue">{tollplaza.project_name || "N/A"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Loại Trạm" span={1}>
            <Tag color="cyan">{tollplaza.type_name || "N/A"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số Làn" span={1}>
            <Tag color="volcano">{tollplaza.lanes}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái" span={1}>
            <Tag color={tollplaza.status === 1 ? "green" : "red"}>
              {tollplaza.status === 1 ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Địa Chỉ" span={2}>
            {tollplaza.address || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô Tả" span={2}>
            {tollplaza.description || "Không có mô tả"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin kênh thu phí */}
      <Card title="Kênh Thu Phí" style={{ marginBottom: 24 }}>
        {tollplaza.channel_codes && tollplaza.channel_codes.length > 0 ? (
          <Table
            rowKey={(record) => `${record.code}-${record.name}`}
            columns={[
              {
                title: "Tên Kênh",
                dataIndex: "name",
                key: "name",
                width: "50%",
                render: (text) => <Tag color="green">{text}</Tag>,
              },
              {
                title: "Mã Kênh",
                dataIndex: "code",
                key: "code",
                width: "50%",
                render: (text) => <Tag color="orange">{text}</Tag>,
              },
            ]}
            dataSource={tollplaza.channel_codes.map((code, index) => ({
              code,
              name: tollplaza.channel_names?.[index] || "N/A",
            }))}
            pagination={false}
            size="small"
            bordered
          />
        ) : (
          <Empty description="Chưa có kênh thu phí" />
        )}
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
            {new Date(tollplaza.created_at || "").toLocaleDateString(
              "vi-VN"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Cập Nhật Cuối">
            {new Date(tollplaza.updated_at || "").toLocaleDateString(
              "vi-VN"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

}