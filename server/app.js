const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS Configuration - Complete setup
const corsOptions = {
  origin: function (origin, callback) {
    // Permetti richieste senza origin (es. Postman, app mobile)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://antofitplanner.vercel.app',
      'https://antofitplanner-netlify.netlify.app',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin bloccata:', origin);
      callback(null, true); // Temporaneamente permetti tutto per debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Applica CORS
app.use(cors(corsOptions));

// Gestisci esplicitamente preflight requests
app.options('*', cors(corsOptions));

// Altri Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylesync');

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

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