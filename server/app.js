const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS - Permetti tutto
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Altri Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection - SOLUZIONE SEMPLICE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylesync')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/garments', require('./routes/garments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/outfits', require('./routes/outfits'));
app.use('/api/stats', require('./routes/stats'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'StyleSync API is running! 🎉',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      garments: '/api/garments',
      test: '/api/test'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🖼️  Upload images to http://localhost:${PORT}/api/garments`);
});

module.exports = app;