const mongoose = require('mongoose');

const garmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  
  cloudinaryId: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'underwear'],
      message: 'Category must be: top, bottom, dress, outerwear, shoes, accessory, or underwear'
    }
  },
  
  subcategory: {
    type: String,
    enum: {
      values: ['t-shirt', 'shirt', 'blouse', 'tank-top', 'sweater', 'hoodie', 'cardigan', 'blazer',
              'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'sweatpants',
              'casual-dress', 'formal-dress', 'maxi-dress', 'mini-dress',
              'jacket', 'coat', 'vest', 'bomber', 'denim-jacket',
              'sneakers', 'boots', 'heels', 'flats', 'sandals', 'dress-shoes',
              'hat', 'bag', 'belt', 'scarf', 'jewelry', 'watch', 'sunglasses'],
      message: 'Invalid subcategory'
    }
  },
  
  primaryColor: {
    type: String,
    required: [true, 'Primary color is required'],
    enum: ['black', 'white', 'gray', 'brown', 'beige', 'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple', 'navy', 'cream', 'multicolor']
  },
  
  secondaryColors: [{
    type: String,
    enum: ['black', 'white', 'gray', 'brown', 'beige', 'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple', 'navy', 'cream']
  }],
  
  style: {
    type: String,
    required: [true, 'Style is required'],
    enum: {
      values: ['casual', 'formal', 'sport', 'business', 'party', 'vintage', 'street', 'bohemian', 'minimalist'],
      message: 'Invalid style'
    }
  },
  
  season: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'all-season']
  }],
  
  occasions: [{
    type: String,
    enum: ['work', 'casual', 'gym', 'date', 'party', 'formal', 'travel', 'home', 'beach']
  }],
  
  brand: {
    type: String,
    trim: true,
    maxlength: [30, 'Brand name cannot exceed 30 characters']
  },
  
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  
  purchaseDate: {
    type: Date
  },
  
  customTags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  
  stats: {
    timesWorn: {
      type: Number,
      default: 0
    },
    lastWorn: {
      type: Date
    },
    timesInOutfits: {
      type: Number,
      default: 0
    }
  },
  
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

garmentSchema.index({ userId: 1, category: 1 });
garmentSchema.index({ userId: 1, primaryColor: 1 });
garmentSchema.index({ userId: 1, style: 1 });

garmentSchema.pre('save', function(next) {
  if (!this.name) {
    const categoryName = this.category.charAt(0).toUpperCase() + this.category.slice(1);
    const colorName = this.primaryColor.charAt(0).toUpperCase() + this.primaryColor.slice(1);
    this.name = `${colorName} ${categoryName}`;
  }
  next();
});

const Garment = mongoose.model('Garment', garmentSchema);

module.exports = Garment;