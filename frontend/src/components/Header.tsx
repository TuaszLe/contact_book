import { Input, Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Search } = Input;

export default function AppHeader() {
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    if (!value) return;
    navigate(`/search?q=${value}`);
  };

  return (
    <Header style={{ background: "#fff", padding: "0 20px" }}>
      <Search
        placeholder="Tìm kiếm ..."
        allowClear
        style={{ width: 300 }}
        onSearch={handleSearch}
      />
    </Header>
  );
}