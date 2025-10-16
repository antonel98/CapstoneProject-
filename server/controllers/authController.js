// server/controllers/authController.js

/**
 * Controller per l'autenticazione utenti
 * Gestisce registrazione, login e recupero profilo
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Genera un JSON Web Token per l'utente
 * @param {string} id - ID utente MongoDB
 * @returns {string} JWT token valido per 30 giorni
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Registra un nuovo utente
 * @route   POST /api/auth/register
 * @access  Public
 * @body    { username, email, password }
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La password deve contenere almeno 6 caratteri'
      });
    }

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: userExists.email === email 
          ? 'Email già registrata' 
          : 'Username già in uso'
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Registrazione completata con successo!',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    console.error('Errore registrazione:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Errore durante la registrazione',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e password sono obbligatori'
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        message: 'Login effettuato con successo!',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          preferences: user.preferences,
          stats: user.stats,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Email o password non corretti'
      });
    }

  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il login',
      error: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Errore recupero profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del profilo',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    if (username) user.username = username;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'Profilo aggiornato con successo',
      data: user
    });

  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del profilo',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};