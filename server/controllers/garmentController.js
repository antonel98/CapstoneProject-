// server/controllers/garmentController.js
const Garment = require('../models/Garment');
const User = require('../models/User');
const path = require('path');

// @desc    Upload nuovo capo
// @route   POST /api/garments
// @access  Private
const uploadGarment = async (req, res) => {
  try {
    console.log('Upload iniziato:', req.body);
    console.log('File ricevuto:', req.file);

    const {
      name,
      category,
      subcategory,
      primaryColor,
      style,
      season,
      occasions,
      brand,
      notes
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nessun file caricato'
      });
    }

    // Il file è già stato caricato da multer
    const imageUrl = `/uploads/${req.file.filename}`;

    // Crea il nuovo capo (con ID utente temporaneo)
    const garment = await Garment.create({
      userId: '507f1f77bcf86cd799439011', // ID temporaneo per test
      name: name || undefined,
      category,
      subcategory,
      primaryColor,
      style,
      imageUrl,
      cloudinaryId: req.file.filename,
      season: season ? JSON.parse(season) : [],
      occasions: occasions ? JSON.parse(occasions) : [],
      brand,
      notes
    });

    console.log('Capo creato con successo:', garment);

    // Statistiche utente commentate per test
    // await User.findByIdAndUpdate(req.user.id, {
    //   $inc: { 'stats.totalGarments': 1 }
    // });

    res.status(201).json({
      success: true,
      message: 'Capo caricato con successo!',
      data: garment
    });

  } catch (error) {
    console.error('Errore upload:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel caricamento del capo',
      error: error.message
    });
  }
};

// @desc    Get tutti i capi dell'utente
// @route   GET /api/garments
// @access  Private
const getUserGarments = async (req, res) => {
  try {
    const {
      category,
      color,
      style,
      page = 1,
      limit = 20
    } = req.query;

    // Costruisci filtro (senza userId per test)
    const filter = {};
    
    if (category) filter.category = category;
    if (color) filter.primaryColor = color;
    if (style) filter.style = style;

    // Calcola skip per paginazione
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const garments = await Garment.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Garment.countDocuments(filter);

    res.json({
      success: true,
      data: garments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Errore get garments:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei capi',
      error: error.message
    });
  }
};

// @desc    Elimina capo
// @route   DELETE /api/garments/:id
// @access  Private
const deleteGarment = async (req, res) => {
  try {
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({
        success: false,
        message: 'Capo non trovato'
      });
    }

    // Controllo proprietà commentato per test
    // if (garment.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Non autorizzato'
    //   });
    // }

    await garment.deleteOne();

    // Statistiche utente commentate per test
    // await User.findByIdAndUpdate(req.user.id, {
    //   $inc: { 'stats.totalGarments': -1 }
    // });

    res.json({
      success: true,
      message: 'Capo eliminato'
    });

  } catch (error) {
    console.error('Errore delete:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione',
      error: error.message
    });
  }
};

module.exports = {
  uploadGarment,
  getUserGarments,
  deleteGarment
};