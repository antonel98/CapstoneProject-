// client/src/config.js

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://antofitplanner-backend.onrender.com/api'  // URL backend Render (lo cambieremo dopo)
  : 'http://localhost:5000/api';

export default API_URL;