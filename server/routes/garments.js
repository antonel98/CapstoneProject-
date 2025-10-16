// server/routes/garments.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import controller
const { 
  uploadGarment, 
  getGarments, 
  deleteGarment,
  toggleFavorite
} = require('../controllers/garmentController');

// Import middleware autenticazione
const { protect } = require('../middleware/auth');

// Configurazione multer per upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'garment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini sono permesse (jpeg, jpg, png, gif, webp)'));
    }
  }
});

/**
 * Tutte le routes sono protette - richiedono autenticazione
 */

// POST /api/garments - Upload nuovo capo
router.post('/', protect, upload.single('image'), uploadGarment);

// GET /api/garments - Recupera tutti i capi dell'utente
router.get('/', protect, getGarments);

// DELETE /api/garments/:id - Elimina un capo
router.delete('/:id', protect, deleteGarment);

// PATCH /api/garments/:id/favorite - Toggle preferito
router.patch('/:id/favorite', protect, toggleFavorite);

module.exports = router;