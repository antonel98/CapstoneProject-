// server/controllers/garmentController.js

/**
 * Controller per la gestione dei capi d'abbigliamento
 * Gestisce operazioni CRUD (Create, Read, Delete) sui capi dell'utente
 */

const Garment = require('../models/Garment');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Upload nuovo capo d'abbigliamento
 * @route   POST /api/garments
 * @access  Private (richiede autenticazione)
 */
const uploadGarment = async (req, res) => {
  try {
    // Usa l'ID dell'utente autenticato
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nessun file caricato'
      });
    }

    const { category, color, season, tags } = req.body;

    const garment = await Garment.create({
      userId,
      imageUrl: `/uploads/${req.file.filename}`,
      category,
      color: color || 'unknown',
      season: season || 'all-season',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    // Aggiorna contatore capi utente
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalGarments': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Capo caricato con successo!',
      data: garment
    });

  } catch (error) {
    console.error('Errore upload capo:', error);
    
    if (req.file) {
      const filepath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Errore durante l\'upload del capo',
      error: error.message
    });
  }
};

/**
 * @desc    Recupera tutti i capi dell'utente
 * @route   GET /api/garments
 * @access  Private
 */
const getGarments = async (req, res) => {
  try {
    // Filtra solo i capi dell'utente autenticato
    const userId = req.user.id;
    const garments = await Garment.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: garments.length,
      data: garments
    });

  } catch (error) {
    console.error('Errore recupero capi:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei capi',
      error: error.message
    });
  }
};

/**
 * @desc    Elimina un capo
 * @route   DELETE /api/garments/:id
 * @access  Private
 */
const deleteGarment = async (req, res) => {
  try {
    const userId = req.user.id;
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({
        success: false,
        message: 'Capo non trovato'
      });
    }

    // Verifica che il capo appartenga all'utente
    if (garment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a eliminare questo capo'
      });
    }

    // Elimina file fisico
    const filepath = path.join(__dirname, '../../uploads', path.basename(garment.imageUrl));
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Garment.findByIdAndDelete(req.params.id);

    // Aggiorna contatore capi utente
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalGarments': -1 }
    });

    res.json({
      success: true,
      message: 'Capo eliminato con successo'
    });

  } catch (error) {
    console.error('Errore eliminazione capo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione del capo',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle preferito su un capo
 * @route   PATCH /api/garments/:id/favorite
 * @access  Private
 */
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({
        success: false,
        message: 'Capo non trovato'
      });
    }

    // Verifica che il capo appartenga all'utente
    if (garment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo capo'
      });
    }

    // Toggle preferito
    garment.isFavorite = !garment.isFavorite;
    await garment.save();

    res.json({
      success: true,
      message: garment.isFavorite ? 'Aggiunto ai preferiti!' : 'Rimosso dai preferiti',
      data: garment
    });

  } catch (error) {
    console.error('Errore toggle preferito:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento',
      error: error.message
    });
  }
};

module.exports = {
  uploadGarment,
  getGarments,
  deleteGarment,
  toggleFavorite
};