# AntoFitPlanner 👗✨

> Il tuo guardaroba intelligente che crea outfit perfetti automaticamente
>
> link: https://antofitplanner.vercel.app/

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/antonel98/CapstoneProject-)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-Frontend-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933)](https://nodejs.org/)

---

## 📖 Indice

- [Panoramica](#panoramica)
- [Problema e Soluzione](#problema-e-soluzione)
- [Funzionalità](#funzionalità)
- [Tech Stack](#tech-stack)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Algoritmo di Matching](#algoritmo-di-matching)
- [Struttura Progetto](#struttura-progetto)
- [Roadmap](#roadmap)
- [Autore](#autore)

---

## 🎯 Panoramica

**AntoFitPlanner** è un'applicazione web full-stack che risolve il problema quotidiano di decidere cosa indossare. Utilizza algoritmi intelligenti basati su teoria del colore e compatibilità degli stili per generare automaticamente outfit coordinati dal tuo guardaroba digitale.

### Demo Live
🚀 **Coming Soon** - L'applicazione sarà disponibile online entro il 21 ottobre 2025

### Screenshots

> 📸 *Screenshot verranno aggiunti durante il Giorno 2*

---

## 💡 Problema e Soluzione

### Il Problema
Ogni mattina milioni di persone:
- Perdono tempo prezioso davanti al guardaroba
- Non sanno come abbinare i colori correttamente
- Ripetono sempre gli stessi outfit
- Non sfruttano appieno i capi che possiedono

### La Soluzione
AntoFitPlanner digitalizza il tuo guardaroba e:
- ✅ Genera outfit automatici in secondi
- ✅ Applica regole di styling professionali
- ✅ Suggerisce abbinamenti basati su teoria del colore
- ✅ Ti fa scoprire nuove combinazioni dei tuoi capi

---

## ⚡ Funzionalità

### Versione Corrente (V1)

#### 📸 Upload e Catalogazione Capi
- Upload foto 
- Categorizzazione per tipo (top, bottom, dress, shoes, etc.)
- Classificazione per colore
- Tag per stile (casual, formal, sport, business, party)


#### 👔 Gestione Guardaroba
- Visualizzazione di tutti i capi
- Filtri per categoria, colore e stile
- Eliminazione capi con conferma

#### ✨ Generazione Outfit Automatica
- Algoritmo di matching colori basato su teoria del colore
- Compatibilità stili per coerenza estetica
- Sistema di scoring (0-100) per ranking outfit
- Filtri per occasione (lavoro, casual, festa, etc.)
- Visualizzazione outfit con dettagli e punteggio
- 🔐 Sistema di autenticazione completo (JWT)
- 📊 Dashboard con statistiche personali

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI Library
- **Axios** - HTTP Client per comunicazione API
- **CSS3** - Styling con Custom Properties e Grid Layout
- **Google Fonts** - Typography (Tangerine)

### Backend
- **Node.js** - JavaScript Runtime
- **Express** 4.18.2 - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** 7.5.0 - ODM per MongoDB
- **Multer** - File Upload Middleware
- **BCrypt** - Password Hashing
- **JSON Web Tokens** - Autenticazione

### Tools & DevOps
- **Git** - Version Control
- **GitHub** - Repository Hosting
- **VS Code** - IDE
- **Nodemon** - Auto-reload in development
- **MongoDB Compass** - Database GUI

---

## 📦 Installazione

### Prerequisiti
- **Node.js** (v14 o superiore)
- **MongoDB** (installato e running)
- **npm** o **yarn**

### Clone del Repository
```bash
git clone https://github.com/antonel98/CapstoneProject-.git
cd CapstoneProject-
```

### Setup Backend
```bash
cd server
npm install

# Crea file .env con le seguenti variabili:
# MONGODB_URI=mongodb://localhost:27017/antofitplanner
# JWT_SECRET=your-super-secret-jwt-key
# PORT=5000

npm run dev
```

Il server sarà disponibile su `http://localhost:5000`

### Setup Frontend
```bash
cd client
npm install
npm start
```

Il frontend sarà disponibile su `http://localhost:3000`

---

## 🚀 Utilizzo

### 1. Avvia l'Applicazione
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

### 2. Carica i Tuoi Capi
- Naviga alla sezione **"Carica Capi"**
- Seleziona un'immagine del capo
- Compila i campi: categoria, colore, stile
- Clicca su **"Carica Capo"**

### 3. Visualizza il Guardaroba
- Vai a **"Guardaroba"**
- Usa i filtri per cercare capi specifici
- Elimina capi non più necessari

### 4. Genera Outfit
- Accedi a **"Genera Outfit"**
- Scegli filtri opzionali (occasione, stile)
- Clicca su **"Genera Outfit"**
- Visualizza le combinazioni suggerite con punteggi

---

## 🎨 Algoritmo di Matching

### Logica di Base

L'algoritmo genera outfit seguendo questi step:

1. **Separazione per Categoria**
   - Top, Bottom, Dress, Shoes, Outerwear, Accessories

2. **Generazione Combinazioni**
   - Top + Bottom + Shoes
   - Dress + Shoes

3. **Validazione Compatibilità**
   ```javascript
   // Verifica colori
   areColorsCompatible(color1, color2)
   
   // Verifica stili
   areStylesCompatible(style1, style2)
   ```

4. **Calcolo Score (0-100)**
   - Base: 50 punti
   - +10 stesso colore top-bottom
   - +15 stesso stile
   - +10 compatibilità colori con scarpe
   - +5 per colori neutri (versatili)

### Matrice Compatibilità Colori

```javascript
colorCompatibility = {
  black: ['white', 'gray', 'red', 'blue', ...],
  blue: ['white', 'gray', 'black', 'brown', ...],
  // ... basato su teoria del colore
}
```

### Matrice Compatibilità Stili

```javascript
styleCompatibility = {
  casual: ['casual', 'sport'],
  formal: ['formal', 'business'],
  // ... per coerenza estetica
}
```

---

## 📁 Struttura Progetto

```
CapstoneProject/
├── client/                      # Frontend React
│   ├── public/
│   │   ├── index.html          # HTML principale
│   │   └── header-bg.jpg       # Immagine header
│   ├── src/
│   │   ├── components/         # Componenti React
│   │   │   ├── GarmentUpload.jsx
│   │   │   ├── WardrobeGallery.jsx
│   │   │   └── OutfitGenerator.jsx
│   │   ├── App.js              # Componente principale
│   │   ├── index.css           # Stili globali
│   │   └── index.js            # Entry point
│   └── package.json
│
├── server/                      # Backend Node.js
│   ├── models/                  # Schema MongoDB
│   │   ├── User.js
│   │   ├── Garment.js
│   │   └── Outfit.js
│   ├── controllers/             # Logica business
│   │   ├── garmentController.js
│   │   └── outfitController.js
│   ├── routes/                  # Endpoint API
│   │   ├── garments.js
│   │   ├── outfits.js
│   │   └── auth.js
│   ├── middleware/              # Middleware Express
│   │   ├── upload.js
│   │   └── auth.js
│   ├── utils/                   # Utility functions
│   │   └── outfitMatcher.js    # Algoritmo matching
│   ├── uploads/                 # Storage immagini
│   ├── app.js                   # Setup Express
│   └── package.json
│
├── .gitignore
└── README.md

---

## 👨‍💻 

**Antonella Esposito** (@antonel98)
- GitHub: [@antonel98](https://github.com/antonel98)
- Progetto: [CapstoneProject-](https://github.com/antonel98/CapstoneProject-)




**Made with ❤️ and lots of ☕**
