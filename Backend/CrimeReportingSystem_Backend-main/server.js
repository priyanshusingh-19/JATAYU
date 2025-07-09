const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes (to be added)
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/alerts', require('./routes/alerts'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);

// Socket.io setup for real-time features
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], 
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  // Handle live streaming
  socket.on('stream', (data) => {
    socket.broadcast.emit('stream', data);
  });
  
  // Handle alerts
  socket.on('alert', (data) => {
    console.log('New alert:', data);
    io.emit('newAlert', data);
  });
});