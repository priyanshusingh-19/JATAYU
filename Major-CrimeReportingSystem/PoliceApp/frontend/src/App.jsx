import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Pages/Home'
import Login from "./Pages/LoginPolice";
import Register from "./Pages/RegisterPolice";
import Reports from "./Pages/Reports";
import Profile from "./Pages/PoliceProfile";
import View from "./Pages/View";
import AlertSend from "./Pages/Alert";
// import Dashboard from './Pages/Dashboard';
// import LocateService from "./Pages/LocateService";
// import Community from "./Pages/Community"
import NotFound from "./Pages/NotFound";

import "./app.css";


function App() {

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/emergency" element={<EmergencyContacts />} />
          <Route path="/guide" element={<SafetyGuide />} />*/}

          <Route element={<ProtectedRoute />}>
            <Route path="/report/police" element={<Reports />} />
            <Route path="/profile/police" element={<Profile />} />
            <Route path="/report/:id" element={<View />} />
            <Route path="/alert/send" element={<AlertSend />} />
            {/* <Route path="/dashboard/user" element={<Dashboard />} />
            <Route path="/map/user" element={<LocateService />} />
            <Route path="/join/user" element={<Community />} /> */}

            {/* <Route path="/history" element={<ReportHistory />} /> */}
            {/* <Route path="/live" element={<LiveStream />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
