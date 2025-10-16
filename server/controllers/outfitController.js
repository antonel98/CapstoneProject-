// server/controllers/outfitController.js

/**
 * Controller per la generazione automatica di outfit
 * Utilizza algoritmi di matching basati su compatibilità colori e stili
 */

const Garment = require('../models/Garment');
const { generateOutfits, calculateOutfitScore } = require('../utils/outfitMatcher');

/**
 * @desc    Genera outfit automatici per l'utente
 * @route   POST /api/outfits/generate
 * @access  Private
 */
const generateUserOutfits = async (req, res) => {
  try {
    // Usa l'ID dell'utente autenticato
    const userId = req.user.id;
    const { count = 5, occasion } = req.body;

    // Recupera solo i capi dell'utente autenticato
    const garments = await Garment.find({ userId });

    // Minimo 2 capi per generare outfit
    if (garments.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Servono almeno 2 capi per generare outfit',
        hint: 'Carica più capi nel tuo guardaroba prima di generare outfit!'
      });
    }

    // Conta le categorie disponibili
    const categories = garments.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {});

    const hasDress = categories.dress > 0;
    const hasTop = categories.top > 0;
    const hasBottom = categories.bottom > 0;
    const hasOuterwear = categories.outerwear > 0;
    const hasShoes = categories.shoes > 0;

    // Verifica combinazioni valide:
    // - Dress + qualsiasi altra cosa
    // - Top + Bottom
    // - Top o Bottom + qualsiasi altra cosa (se almeno 2 capi totali)
    const canGenerateOutfits = hasDress || (hasTop && hasBottom) || garments.length >= 2;

    if (!canGenerateOutfits) {
      return res.status(400).json({
        success: false,
        message: 'Non hai abbastanza capi compatibili per generare outfit',
        hint: 'Carica almeno: un vestito OPPURE un top + un bottom',
        currentCategories: Object.keys(categories)
      });
    }

    // Genera outfit
    const outfits = generateOutfits(garments, parseInt(count), occasion);

    if (outfits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Impossibile generare outfit con i capi disponibili',
        hint: 'Prova ad aggiungere capi con colori più coordinabili o categorie diverse',
        totalGarments: garments.length,
        categories: Object.keys(categories)
      });
    }

    // Calcola score medio
    const avgScore = outfits.reduce((acc, outfit) => acc + outfit.score, 0) / outfits.length;

    res.json({
      success: true,
      message: `${outfits.length} outfit generati con successo!`,
      data: outfits,
      meta: {
        totalGarments: garments.length,
        generatedOutfits: outfits.length,
        averageScore: avgScore.toFixed(2),
        occasion: occasion || 'any',
        categories: Object.keys(categories)
      }
    });

  } catch (error) {
    console.error('Errore generazione outfit:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la generazione degli outfit',
      error: error.message
    });
  }
};

module.exports = {
  generateUserOutfits
};