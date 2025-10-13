// server/controllers/outfitController.js
const Garment = require('../models/Garment');
const { generateOutfits, generateOutfitsByOccasion } = require('../utils/outfitMatcher');

// @desc    Genera outfit automatici
// @route   POST /api/outfits/generate
// @access  Private
const generateOutfitsForUser = async (req, res) => {
  try {
    const { occasion, style } = req.body;
    
    // Prendi tutti i capi disponibili (per test senza userId)
    let filter = { isAvailable: true };
    
    if (style) filter.style = style;
    
    const garments = await Garment.find(filter);
    
    if (garments.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Servono almeno 3 capi per generare outfit (top, bottom, scarpe)'
      });
    }
    
    // Genera outfit
    const outfits = occasion 
      ? generateOutfitsByOccasion(garments, occasion)
      : generateOutfits(garments);
    
    if (outfits.length === 0) {
      return res.json({
        success: true,
        message: 'Nessun outfit compatibile trovato con questi capi',
        data: []
      });
    }
    
    // Popola i dettagli dei capi
    const populatedOutfits = await Promise.all(
      outfits.map(async (outfit) => {
        const populatedGarments = await Promise.all(
          outfit.garments.map(async (g) => {
            const garment = await Garment.findById(g.garmentId);
            return {
              ...g,
              details: garment
            };
          })
        );
        
        return {
          ...outfit,
          garments: populatedGarments
        };
      })
    );
    
    res.json({
      success: true,
      message: `${outfits.length} outfit generati!`,
      data: populatedOutfits
    });
    
  } catch (error) {
    console.error('Errore generazione outfit:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella generazione degli outfit',
      error: error.message
    });
  }
};

module.exports = {
  generateOutfitsForUser
};