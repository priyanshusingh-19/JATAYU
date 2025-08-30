import AuthContext from "../context/authContext"; 
import React, { useEffect, useState } from "react";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [police, setPolice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState(null);

  // Fetch logged-in Police from session cookie
  const fetchPolice = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/police/me", {
        withCredentials: true,
      });

      if (res.data.success) {
        setPolice(res.data.police);
        fetchPoliceProfile(res.data.police._id);
      } else {
        setPolice(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setPolice(null);
    } finally {
      setLoading(false);
    }
  };

  // On load: check Police
  useEffect(() => {
    fetchPolice();
  }, []);

  const fetchPoliceProfile = async (policeId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/police/profile/${policeId}`,
        { withCredentials: true }
      );
      setAllData(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const loginPolice = async (StationName, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/police/login",
        { StationName, password },
        { withCredentials: true }
      );

      if (data.success) {
        setPolice(data.police);
        fetchPoliceProfile(data.police._id);
        return { success: true };
      }

      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const registerPolice = async (policeData) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/police/register",
        policeData,
        { withCredentials: true }
      );
      setPolice(data.police);
      fetchPoliceProfile(data.police._id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async (navigate) => {
    try {
      await fetch("http://localhost:5001/api/police/logout", {
        method: "get",
        credentials: "include",
      });
      setPolice(null);
      setAllData(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ police, allData, loading, loginPolice, registerPolice, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
