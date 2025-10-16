const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  preferences: {
    favoriteColors: [{
      type: String,
      enum: ['black', 'white', 'gray', 'brown', 'beige', 'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple', 'navy', 'cream']
    }],
    
    preferredStyles: [{
      type: String,
      enum: ['casual', 'formal', 'sport', 'business', 'party', 'vintage', 'street']
    }],
    
    commonOccasions: [{
      type: String,
      enum: ['work', 'casual', 'gym', 'date', 'party', 'formal', 'travel']
    }]
  },
  
  profilePicture: {
    type: String,
    default: ''
  },
  
  stats: {
    totalGarments: {
      type: Number,
      default: 0
    },
    totalOutfits: {
      type: Number,
      default: 0
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Hash della password prima del salvataggio
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Metodo per verificare la password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Rimuovi password quando converti a JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;