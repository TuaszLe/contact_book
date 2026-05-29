import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Contacts from "./pages/contact/Contacts";
import Tollplaza from "./pages/tollplaza/Tollplaza";
import TollplazaDetail from "./pages/tollplaza/TollplazaDetail";
import TollplazaMap from "./pages/map/TollplazaMap";
import Parking from "./pages/parking/Parking";
import ParkingDetail from "./pages/parking/ParkingDetail";
import Lich_bao_tri from "./pages/sharepoint/Lich_bao_tri";
import So from "./pages/sharepoint/So";
import SearchPage from "./pages/searchpage";
import OfficeDetail from "./pages/office/OfficeDetail";
import Office from "./pages/office/Office";
import Ds_truong_tuyen from "./pages/sharepoint/ds_truong_tuyen";
import Xu_Ly_Lv_1 from "./pages/sharepoint/xu_ly_lv_1";
import Contractor from "./pages/contractor/Contractor";
import ContractorDetail from "./pages/contractor/ContracDetail";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/tollplaza" element={<Tollplaza />} />
          <Route path="/tollplaza/:id" element={<TollplazaDetail />} />
          <Route path="/map" element={<TollplazaMap />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/parking/:id" element={<ParkingDetail />} />
          <Route path="/mtnc" element={<Lich_bao_tri />} />
          <Route path="/so" element={<So />} />
          <Route path="/ds_truong_tuyen" element={<Ds_truong_tuyen />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/office" element={<Office />} />
          <Route path="/office/:id" element={<OfficeDetail />} />
          <Route path="/xu_ly_lv_1" element={<Xu_Ly_Lv_1 />} />
          <Route path="/contractor" element={<Contractor />} />
          <Route path="/contractor/:id" element={<ContractorDetail />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
