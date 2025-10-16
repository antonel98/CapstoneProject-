// server/models/Garment.js

const mongoose = require('mongoose');

/**
 * Schema per i capi d'abbigliamento
 * Ogni capo appartiene a un utente specifico
 */
const garmentSchema = new mongoose.Schema({
  // Riferimento all'utente proprietario
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Indice per query veloci
  },
  
  // URL dell'immagine del capo
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  
  // Categoria del capo
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories', 'bag', 'jewelry'],
      message: '{VALUE} non è una categoria valida'
    }
  },
  
  // Colore principale del capo
  color: {
    type: String,
    enum: [
      'black', 'white', 'gray', 'brown', 'beige', 
      'red', 'pink', 'orange', 'yellow', 
      'green', 'blue', 'purple', 'navy', 'cream',
      'unknown'
    ],
    default: 'unknown'
  },
  
  // Stagione consigliata
  season: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'all-season'],
    default: 'all-season'
  },
  
  // Tag personalizzati (es: 'casual', 'preferito', 'comodo')
  tags: [{
    type: String,
    trim: true
  }],
  
  // Stile del capo (opzionale)
  style: {
    type: String,
    enum: ['casual', 'formal', 'sport', 'business', 'party', 'vintage', 'street', 'other'],
    default: 'casual'
  },
  
  // Note personali (opzionale)
  notes: {
    type: String,
    maxlength: [500, 'Le note non possono superare 500 caratteri']
  },
  
  // Data di acquisto (opzionale)
  purchaseDate: {
    type: Date
  },
  
  // Prezzo (opzionale - per statistiche)
  price: {
    type: Number,
    min: 0
  },
  
  // Brand (opzionale)
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Il brand non può superare 100 caratteri']
  },
  
  // Numero di volte utilizzato in outfit
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Preferito
  isFavorite: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true // Aggiunge createdAt e updatedAt automaticamente
});

// Indici per performance
garmentSchema.index({ userId: 1, category: 1 });
garmentSchema.index({ userId: 1, color: 1 });
garmentSchema.index({ userId: 1, season: 1 });
garmentSchema.index({ userId: 1, isFavorite: 1 });

// Metodo per incrementare contatore utilizzo
garmentSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Metodo per toggle preferito
garmentSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

const Garment = mongoose.model('Garment', garmentSchema);

module.exports = Garment;