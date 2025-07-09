const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, police } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'video/mp4'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100 // 100MB max file size
  },
  fileFilter: fileFilter
});

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post('/', protect, upload.array('media', 5), async (req, res) => {
  try {
    const { title, description, incidentType, latitude, longitude, address } = req.body;

    // Handle file uploads
    const mediaUrls = req.files ? req.files.map(file => file.path) : [];

    const report = new Report({
      user: req.user._id,
      title,
      description,
      incidentType,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address
      },
      mediaUrls
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/reports/user
// @desc    Get all reports for logged in user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/reports
// @desc    Get all reports (for police/admin)
// @access  Private/Police
router.get('/', protect, police, async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update report status
// @access  Private/Police
router.put('/:id', protect, police, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const report = await Report.findById(req.params.id);

    if (report) {
      report.status = status || report.status;
      report.assignedTo = assignedTo || report.assignedTo;
      report.updatedAt = Date.now();

      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// @route   GET /api/reports/:id
// @desc    Get a single report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/reports/:id
// @desc    Get a single report by ID
// @access  Private


router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid report ID format' });
    }

    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;