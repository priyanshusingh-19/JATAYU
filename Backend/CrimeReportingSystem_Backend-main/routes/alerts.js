const express = require("express");
const router = express.Router();
const { checkAuth, checkAdmin } = require("../middleware/Authmiddleware");
const Alert = require("../models/Alert");

//  Create a new alert (Admin or Authorized User)
router.post("/", checkAuth, async (req, res) => {
  try {
    const { title, description, location, severity } = req.body;

    if (!title || !description || !location || !severity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const alert = new Alert({
      title,
      description,
      location,
      severity,
      createdBy: req.user.id,
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Fetch all alerts (Public)
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Fetch a single alert by ID
router.get("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update an alert (Only Admins)
router.put("/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    const { title, description, location, severity } = req.body;

    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.title = title || alert.title;
    alert.description = description || alert.description;
    alert.location = location || alert.location;
    alert.severity = severity || alert.severity;

    await alert.save();
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete an alert (Only Admins)
router.delete("/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    await alert.deleteOne();
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
