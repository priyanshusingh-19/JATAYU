const express = require("express");
const router = express.Router();
const Station = require("../models/StationModel");

//  Get all police stations
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
