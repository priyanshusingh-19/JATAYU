const express = require("express");
const router = express.Router();
const Report = require("../../../SharedModels/report");
const { PoliceAuth } = require("../middleware");

router.get("/", PoliceAuth, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(401).json({ message: "Failed to fetch reports" });
  }
});

router.get("/:id", PoliceAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (report) {
      res.status(200).json({ success: true, report });
    } else {
      res.status(404).json({ success: false, message: "No report found" });
    }

  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
