// server/routes/stats.js

const express = require('express');
const router = express.Router();

// Import controller
const { getUserStats, getCategoryStats } = require('../controllers/statsController');

// Import middleware autenticazione
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/stats
 * @desc    Recupera statistiche complete utente
 * @access  Private
 */
router.get('/', protect, getUserStats);

/**
 * @route   GET /api/stats/category/:category
 * @desc    Recupera statistiche per categoria specifica
 * @access  Private
 */
router.get('/category/:category', protect, getCategoryStats);

module.exports = router;