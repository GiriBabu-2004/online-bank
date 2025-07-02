// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
