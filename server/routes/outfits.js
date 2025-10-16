// server/routes/outfits.js

const express = require('express');
const router = express.Router();

// Import controller
const { generateUserOutfits } = require('../controllers/outfitController');

// Import middleware autenticazione
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/outfits/generate
 * @desc    Genera outfit automatici per l'utente
 * @access  Private (richiede autenticazione)
 */
router.post('/generate', protect, generateUserOutfits);

module.exports = router;