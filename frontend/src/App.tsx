import { BrowserRouter,Routes,Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Tollplaza from "./pages/tollplaza/Tollplaza";
import TollplazaDetail from "./pages/tollplaza/TollplazaDetail";
import Parking from "./pages/parking/Parking";
import ParkingDetail from "./pages/parking/ParkingDetail";
import Lich_bao_tri from "./pages/sharepoint/Lich_bao_tri";
import So from "./pages/sharepoint/So";
import SearchPage from "./pages/searchpage";

function App(){

 return(

  <BrowserRouter>

   <AppLayout>

    <Routes>

      <Route path="/" element={<Dashboard/>}/>
      <Route path="/contacts" element={<Contacts/>}/>
      <Route path="/tollplaza" element={<Tollplaza />} />
      <Route path="/tollplaza/:id" element={<TollplazaDetail />} />
      <Route path="/parking" element={<Parking />} />
      <Route path="/parking/:id" element={<ParkingDetail />} />
      <Route path="/mtnc" element={<Lich_bao_tri />} />
      <Route path="/so" element={<So />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>

   </AppLayout>

  </BrowserRouter>

 )

}

export default App