import axios from "axios";

const API = "http://127.0.0.1:8059/api";

const api = axios.create({
  baseURL: API,
});

/* CONTACTS */

export const getContacts = async (search = "") => {
  const res = await api.get("/contacts/", {
    params: { search },
  });
  return res.data;
};

/* TOLLPLAZA */

export const getTollplaza = async (search = "") => {
  const res = await api.get("/tollplazas/", {
    params: { search },
  });
  return res.data;
};

export const getTollplazaDetail = async (id: number) => {

  const res = await axios.get(`${API}/tollplazas/${id}/`);

  return res.data;

};

/* Parking */

export const getParking = async (search = "") => {
  const res = await api.get("/parkings/", {
    params: { search },
  });
  return res.data;
};

export const getParkingDetail = async (id: number) => {
  const res = await axios.get(`${API}/parkings/${id}/`);
  return res.data;
};

export default api;