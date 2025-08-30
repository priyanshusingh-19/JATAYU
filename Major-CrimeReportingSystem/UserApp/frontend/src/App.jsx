import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Pages/Home'
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ReportForm from "./Pages/Report";
import Dashboard from './Pages/Dashboard';
import Profile from "./Pages/Profile";
import LocateService from "./Pages/LocateService";
import AlertList from "./Pages/Alert";
import Community from "./Pages/Community"
import NotFound from "./Pages/NotFound";
import View from "./Pages/View";

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
            <Route path="/dashboard/user" element={<Dashboard />} />
            <Route path="/report/user" element={<ReportForm />} />
            <Route path="/profile/user" element={<Profile />} />
            <Route path="/map/user" element={<LocateService />} />
            <Route path="/alert/user" element={<AlertList />} /> 
            <Route path="/join/user" element={<Community />} />
            <Route path="/report/:id" element={<View />} />

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
