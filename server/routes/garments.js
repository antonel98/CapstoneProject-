const express = require('express');
const router = express.Router();  // ← Questa riga era mancante!

// Import controllers
const {
  uploadGarment,
  getUserGarments,
  deleteGarment
} = require('../controllers/garmentController');

// Import middleware
const { upload, handleUploadError, validateUpload } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// @route   POST /api/garments
// @desc    Upload nuovo capo
// @access  Private
router.post('/', 
  upload,
  handleUploadError,
  validateUpload,
  uploadGarment
);

// @route   GET /api/garments
// @desc    Get tutti i capi dell'utente
// @access  Private
router.get('/' , getUserGarments);

// @route   DELETE /api/garments/:id
// @desc    Elimina capo
// @access  Private
router.delete('/:id', deleteGarment);

module.exports = router;