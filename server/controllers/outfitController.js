// server/controllers/outfitController.js

/**
 * Controller per la generazione automatica di outfit
 * Utilizza algoritmi di matching basati su compatibilità colori e stili
 */

const Garment = require('../models/Garment');
const { generateOutfits, generateOutfitsByOccasion } = require('../utils/outfitMatcher');

/**
 * @desc    Genera outfit automatici basati sui capi dell'utente
 * @route   POST /api/outfits/generate
 * @access  Private (da implementare con autenticazione)
 * @body    { occasion?: string, style?: string }
 * 
 * Algoritmo:
 * 1. Recupera tutti i capi disponibili dell'utente
 * 2. Applica filtri opzionali (stile, occasione)
 * 3. Genera combinazioni compatibili usando algoritmo di matching
 * 4. Ordina per punteggio di compatibilità
 * 5. Restituisce i migliori 6 outfit
 */
const generateOutfitsForUser = async (req, res) => {
  try {
    // Estrae parametri opzionali per filtrare la generazione
    const { occasion, style } = req.body;
    
    // Costruisce filtro per recuperare solo capi disponibili
    // TODO: Aggiungere { userId: req.user.id } dopo implementazione autenticazione
    let filter = { isAvailable: true };
    
    // Applica filtro stile se specificato
    if (style) {
      filter.style = style;
    }
    
    // Recupera tutti i capi che corrispondono ai criteri
    const garments = await Garment.find(filter);
    
    // Verifica che ci siano abbastanza capi per creare outfit
    // Serve almeno: 1 top + 1 bottom + 1 paio di scarpe (o 1 dress + scarpe)
    if (garments.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Servono almeno 3 capi per generare outfit (top, bottom, scarpe)',
        hint: 'Carica più capi nel tuo guardaroba per creare combinazioni'
      });
    }
    
    // Genera outfit usando l'algoritmo appropriato
    const outfits = occasion 
      ? generateOutfitsByOccasion(garments, occasion) // Con filtro occasione
      : generateOutfits(garments); // Senza filtri
    
    // Gestisce caso in cui nessun outfit è stato generato
    if (outfits.length === 0) {
      return res.json({
        success: true,
        message: 'Nessun outfit compatibile trovato con questi capi',
        hint: 'Prova a caricare capi con colori e stili più vari',
        data: []
      });
    }
    
    // Popola i dettagli completi di ogni capo negli outfit generati
    const populatedOutfits = await Promise.all(
      outfits.map(async (outfit) => {
        // Per ogni capo nell'outfit, recupera i dettagli completi dal database
        const populatedGarments = await Promise.all(
          outfit.garments.map(async (g) => {
            const garment = await Garment.findById(g.garmentId);
            return {
              ...g,
              details: garment // Aggiunge tutti i dettagli del capo
            };
          })
        );
        
        return {
          ...outfit,
          garments: populatedGarments
        };
      })
    );
    
    // Risposta con outfit generati
    res.json({
      success: true,
      message: `${outfits.length} outfit${outfits.length > 1 ? 's' : ''} generato${outfits.length > 1 ? 'i' : ''}!`,
      data: populatedOutfits,
      meta: {
        totalGarments: garments.length,
        averageScore: Math.round(
          outfits.reduce((acc, o) => acc + o.score, 0) / outfits.length
        )
      }
    });
    
  } catch (error) {
    console.error('Errore generazione outfit:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella generazione degli outfit',
      error: error.message
    });
  }
};

// Esporta il controller
module.exports = {
  generateOutfitsForUser
};