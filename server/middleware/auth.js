const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per proteggere le route
const protect = async (req, res, next) => {
  try {
    let token;

    // Controlla se il token è nell'header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accesso negato. Token non fornito.'
      });
    }

    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trova l'utente e aggiungilo alla request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token non valido.'
      });
    }

    next();

  } catch (error) {
    console.error('Errore autenticazione:', error);
    return res.status(401).json({
      success: false,
      message: 'Token non valido.'
    });
  }
};

module.exports = { protect };