import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// ================== TYPES ==================
type Contact = {
  id: number;
  firstname: string;
  phone: string;
};

type TollPlaza = {
  id: number;
  name: string;
  project_name: string;
};

type Project = {
  id: number;
  name: string;
};

type Contractor = {
  id: number;
  name: string;
};

type Parking = {
  id: number;
  name: string;
};

type SearchResult = {
  contacts: Contact[];
  tollplazas: TollPlaza[];
  projects: Project[];
  contractors: Contractor[];
  parkings: Parking[];
};

// ================== COMPONENT ==================
export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<SearchResult>({
    contacts: [],
    tollplazas: [],
    projects: [],
    contractors: [],
    parkings: [],
  });

  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(location.search);
  const keyword = query.get("q") || "";

  // ================== FETCH ==================
  useEffect(() => {
    if (!keyword) return;

    const delay = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const res = await axios.get(
            `http://localhost:8000/api/search/?q=${keyword}`
          );

          const result: SearchResult = res.data;
          setData(result);

          // ===== auto redirect nếu chỉ có 1 kết quả =====
          const total =
            result.contacts.length +
            result.tollplazas.length +
            result.projects.length +
            result.contractors.length +
            result.parkings.length;

          if (total === 1) {
            if (result.contacts.length === 1)
              return navigate(`/contact/${result.contacts[0].id}`);

            if (result.tollplazas.length === 1)
              return navigate(`/tollplaza/${result.tollplazas[0].id}`);

            if (result.projects.length === 1)
              return navigate(`/project/${result.projects[0].id}`);

            if (result.contractors.length === 1)
              return navigate(`/contractor/${result.contractors[0].id}`);

            if (result.parkings.length === 1)
              return navigate(`/parking/${result.parkings[0].id}`);
          }
        } catch (err) {
          console.error("API error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 400); // debounce 400ms

    return () => clearTimeout(delay);
  }, [keyword, navigate]);

  // ================== EMPTY CHECK ==================
  const isEmpty =
    data.contacts.length === 0 &&
    data.tollplazas.length === 0 &&
    data.projects.length === 0 &&
    data.contractors.length === 0 &&
    data.parkings.length === 0;

  // ================== UI ==================
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Kết quả tìm kiếm: "{keyword}"</h2>

      {/* TollPlaza */}
      {data.tollplazas.length > 0 && (
        <>
          <h3>TollPlaza</h3>
          {data.tollplazas.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/tollplaza/${item.id}`)}
              style={{ cursor: "pointer", padding: 5 }}
            >
              {item.name} - {item.project_name}
            </div>
          ))}
        </>
      )}

      {/* Contact */}
      {data.contacts.length > 0 && (
        <>
          <h3>Contact</h3>
          {data.contacts.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/contact/${item.id}`)}
              style={{ cursor: "pointer", padding: 5 }}
            >
              {item.firstname} - {item.phone}
            </div>
          ))}
        </>
      )}

      {/* Project */}
      {data.projects.length > 0 && (
        <>
          <h3>Project</h3>
          {data.projects.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/project/${item.id}`)}
              style={{ cursor: "pointer", padding: 5 }}
            >
              {item.name}
            </div>
          ))}
        </>
      )}

      {/* Contractor */}
      {data.contractors.length > 0 && (
        <>
          <h3>Contractor</h3>
          {data.contractors.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/contractor/${item.id}`)}
              style={{ cursor: "pointer", padding: 5 }}
            >
              {item.name}
            </div>
          ))}
        </>
      )}

      {/* Parking */}
      {data.parkings.length > 0 && (
        <>
          <h3>Parking</h3>
          {data.parkings.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/parking/${item.id}`)}
              style={{ cursor: "pointer", padding: 5 }}
            >
              {item.name}
            </div>
          ))}
        </>
      )}

      {/* Empty */}
      {isEmpty && <p>Không tìm thấy kết quả</p>}
    </div>
  );
}