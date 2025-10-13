// server/controllers/garmentController.js

/**
 * Controller per la gestione dei capi d'abbigliamento
 * Gestisce operazioni CRUD (Create, Read, Delete) sui capi dell'utente
 */

const Garment = require('../models/Garment');
const User = require('../models/User');
const path = require('path');

/**
 * @desc    Carica un nuovo capo d'abbigliamento nel guardaroba
 * @route   POST /api/garments
 * @access  Private (richiede autenticazione - da implementare)
 */
const uploadGarment = async (req, res) => {
  try {
    // Estrae i dati dal form
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

    // Verifica che sia stato caricato un file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nessun file caricato'
      });
    }

    // Costruisce l'URL dell'immagine caricata
    const imageUrl = `/uploads/${req.file.filename}`;

    // Crea il nuovo capo nel database
    // NOTA: userId temporaneo per sviluppo, sarà sostituito con req.user.id dopo implementazione autenticazione
    const garment = await Garment.create({
      userId: '507f1f77bcf86cd799439011', // TODO: Sostituire con req.user.id
      name: name || undefined, // Se non fornito, verrà generato automaticamente dal model
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

    // TODO: Abilitare dopo implementazione autenticazione
    // Aggiorna le statistiche dell'utente
    // await User.findByIdAndUpdate(req.user.id, {
    //   $inc: { 'stats.totalGarments': 1 }
    // });

    // Risposta di successo
    res.status(201).json({
      success: true,
      message: 'Capo caricato con successo!',
      data: garment
    });

  } catch (error) {
    console.error('Errore upload capo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel caricamento del capo',
      error: error.message
    });
  }
};

/**
 * @desc    Recupera tutti i capi dell'utente con filtri opzionali
 * @route   GET /api/garments
 * @access  Private
 * @query   category, color, style, page, limit
 */
const getUserGarments = async (req, res) => {
  try {
    // Estrae parametri query per filtri e paginazione
    const {
      category,
      color,
      style,
      page = 1,
      limit = 20
    } = req.query;

    // Costruisce il filtro per la query
    // TODO: Aggiungere { userId: req.user.id } dopo implementazione autenticazione
    const filter = {};
    
    // Applica filtri opzionali
    if (category) filter.category = category;
    if (color) filter.primaryColor = color;
    if (style) filter.style = style;

    // Calcola quanti documenti saltare per la paginazione
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Esegue la query con filtri, ordinamento e paginazione
    const garments = await Garment.find(filter)
      .sort({ createdAt: -1 }) // Più recenti prima
      .limit(parseInt(limit))
      .skip(skip);

    // Conta il totale dei documenti per la paginazione
    const total = await Garment.countDocuments(filter);

    // Risposta con dati e info paginazione
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
    console.error('Errore recupero capi:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei capi',
      error: error.message
    });
  }
};

/**
 * @desc    Elimina un capo dal guardaroba
 * @route   DELETE /api/garments/:id
 * @access  Private
 */
const deleteGarment = async (req, res) => {
  try {
    // Trova il capo per ID
    const garment = await Garment.findById(req.params.id);

    // Verifica esistenza
    if (!garment) {
      return res.status(404).json({
        success: false,
        message: 'Capo non trovato'
      });
    }

    // TODO: Abilitare dopo implementazione autenticazione
    // Verifica che il capo appartenga all'utente autenticato
    // if (garment.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Non autorizzato a eliminare questo capo'
    //   });
    // }

    // Elimina il capo dal database
    await garment.deleteOne();

    // TODO: Abilitare dopo implementazione autenticazione
    // Aggiorna statistiche utente
    // await User.findByIdAndUpdate(req.user.id, {
    //   $inc: { 'stats.totalGarments': -1 }
    // });

    // Risposta di successo
    res.json({
      success: true,
      message: 'Capo eliminato con successo'
    });

  } catch (error) {
    console.error('Errore eliminazione capo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del capo',
      error: error.message
    });
  }
};

// Esporta le funzioni del controller
module.exports = {
  uploadGarment,
  getUserGarments,
  deleteGarment
};