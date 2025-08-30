const express = require('express');
const router = express.Router();
const Police = require('../models/police');
const passport = require('passport');
const { PoliceAuth } = require('../middleware');


router.post('/register', async (req, res) => {
  try {
    const { StationName, address, city, state, pincode, phone, password } = req.body;

    const PoliceExists = await Police.findOne({ StationName });
    if (PoliceExists) {
      return res.status(400).json({ success: false, message: 'already exists' });
    }

    const newPolice = new Police({ StationName, address, city, state, pincode, phone });
    const registeredPolice = await Police.register(newPolice, password);

    req.login(registeredPolice, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Login failed after registration' });
      }

      return res.status(201).json({
        success: true,
        police: {
          _id: registeredPolice._id,
          StationName: registeredPolice.StationName,
          pincode: registeredPolice.pincode,
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});


router.post('/login', (req, res, next) => {
   const { StationName, password } = req.body;
  if (!StationName || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
   passport.authenticate('local', (err, police, info) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (!police) return res.status(400).json({ success: false, message: info?.message || 'Invalid credentials' });

    req.login(police, (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Login failed' });

      return res.status(200).json({
        success: true,
        police: {
          _id: police._id,
          StationName: police.StationName,
          pincode: police.pincode,
        }
      });
    });
  })(req, res, next);
});

router.get("/logout",(req,res)=>{
   req.logout((err)=>{
        if(err){
            if (err) return res.status(500).json({ success: false, message: 'Server error' });
        }
        else{
        return res.status(200).json({
        success: true,
        message:"logout successfully!",
      });
        }
    });
});


router.get("/me", PoliceAuth, (req, res) => {
  res.status(200).json({ success: true, police: req.user });
});


router.get('/profile/:id', PoliceAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const police = await Police.findById(id);

    if (police) {
      res.json(police);
    } else {
      res.status(404).json({ message: 'Police not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;