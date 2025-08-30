const express = require("express");
const Alert = require("../models/alert");
const axios = require("axios");

async function geocodeLocation(placeName) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: placeName, format: "json", limit: 1 }
    });

    if (res.data.length === 0) return null;

    return {
      lat: parseFloat(res.data[0].lat),
      lng: parseFloat(res.data[0].lon)
    };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}

function haversineDistance(loc1, loc2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

module.exports = (io, onlineUsers) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { location, message } = req.body;

      if (!location || !message) {
        return res.status(400).json({ success: false, error: "Location and message are required" });
      }

      const coords = await geocodeLocation(location);
      if (!coords) {
        return res.status(400).json({ success: false, error: "Invalid location name" });
      }

      const alert = await Alert.create({
        message,
        locationName:location,
        location: coords,
        timestamp: new Date()
      });
      for (const [socketId, userData] of onlineUsers.entries()) {
        if (!userData.location) continue;
        const dist = haversineDistance(coords, userData.location);
        console.log(dist);
        if (dist <= 5) {
          io.to(socketId).emit("new-alert", alert);
        }
      }

      res.status(201).json({ success: true, alert });
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;
      const alerts = await Alert.find().sort({ timestamp: -1 });

      if (!lat || !lng) {
        return res.json(alerts);
      }

      const filtered = alerts.filter((alert) => {
        if (!alert.location?.lat || !alert.location?.lng) return false;
        const dist = haversineDistance(
          { lat: parseFloat(lat), lng: parseFloat(lng) },
          { lat: alert.location.lat, lng: alert.location.lng }
        );
        return dist <= radius;
      });

      res.json(filtered);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ success: false, error: "Failed to fetch alerts" });
    }
  });

  return router;
};
