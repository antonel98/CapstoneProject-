// server/routes/outfits.js
const express = require('express');
const router = express.Router();
const { generateOutfitsForUser } = require('../controllers/outfitController');

// @route   POST /api/outfits/generate
router.post('/generate', generateOutfitsForUser);

module.exports = router;