// server/middleware/upload.js
const multer = require('multer');
const path = require('path');

// storage locale 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Cartella dove salvare i file
  },
  filename: function (req, file, cb) {
    // Nome file: timestamp_nomefile
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}${extension}`);
  }
});

// Filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configurazione upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter
});

// Middleware per gestire errori
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File troppo grande. Massimo 5MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Solo file immagine sono permessi.'
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Errore upload: ' + error.message
  });
};


const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Nessun file caricato.'
    });
  }
  next();
};

module.exports = {
  upload: upload.single('image'),
  handleUploadError,
  validateUpload
};