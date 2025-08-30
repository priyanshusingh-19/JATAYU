const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS
  }
});

const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;
    const response = await axios.get(url, {
      params: {
        access_token: process.env.MAP_TOKEN,
        limit: 1
      }
    });

    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      return response.data.features[0].place_name;
    } else {
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Mapbox reverse geocoding failed:', error.message);
    return 'Unknown location';
  }
};

router.post('/alert', async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const members = await Community.find();
    const location = await getAddressFromCoordinates(lat, lng);

    let notified = 0;

    for (const member of members) {
      if (member.email) {
        const mailOptions = {
          from: process.env.ALERT_EMAIL,
          to: member.email,
          subject: 'Emergency Alert in Your Area!',
          text: `Dear ${member.name || 'Community Member'},\n\nAn emergency SOS was triggered at:\n${location}\nStay alert and help if you can.\n\n- Community Safety App`
        };
        try {
          await transporter.sendMail(mailOptions);
          notified++;
        } catch (err) {
          console.error(`Failed to send to ${member.email}:`, err.message);
        }
      }
    }

    res.status(200).json({ notified, location });

  } catch (error) {
    console.error("Error sending SOS alert:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
