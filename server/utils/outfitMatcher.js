// server/utils/outfitMatcher.js

/**
 * ALGORITMO DI MATCHING OUTFIT
 * 
 * Questo modulo contiene la logica core per generare outfit automatici
 * basandosi su regole di compatibilità colori e stili.
 * 
 * Principi di Design:
 * - Compatibilità colori basata su teoria del colore
 * - Matching stili per coerenza estetica
 * - Sistema di scoring per ranking outfit
 * - Supporto per diverse occasioni d'uso
 */

// ============================================
// REGOLE DI COMPATIBILITÀ COLORI
// ============================================

/**
 * Matrice di compatibilità colori
 * Definisce quali colori si abbinano bene tra loro
 * Basato su principi di teoria del colore e fashion styling
 */
const colorCompatibility = {
  // Colori neutri - si abbinano con quasi tutto
  black: ['white', 'gray', 'red', 'blue', 'green', 'yellow', 'pink', 'purple'],
  white: ['black', 'gray', 'blue', 'red', 'green', 'brown', 'navy', 'pink'],
  gray: ['black', 'white', 'blue', 'red', 'yellow', 'pink', 'purple'],
  
  // Colori freddi
  blue: ['white', 'gray', 'black', 'brown', 'beige', 'yellow'],
  navy: ['white', 'beige', 'gray'],
  purple: ['black', 'white', 'gray'],
  
  // Colori caldi
  red: ['black', 'white', 'gray', 'beige'],
  pink: ['black', 'white', 'gray', 'blue'],
  yellow: ['black', 'gray', 'blue', 'brown'],
  orange: ['black', 'white', 'brown', 'beige'],
  
  // Colori naturali
  brown: ['white', 'beige', 'blue', 'green', 'yellow'],
  beige: ['brown', 'white', 'blue', 'red', 'green'],
  green: ['black', 'white', 'brown', 'beige'],
  
  cream: ['brown', 'beige', 'blue']
};

/**
 * Matrice di compatibilità stili
 * Definisce quali stili possono essere combinati insieme
 */
const styleCompatibility = {
  casual: ['casual', 'sport'],
  formal: ['formal', 'business'],
  sport: ['sport', 'casual'],
  business: ['business', 'formal'],
  party: ['party', 'formal'],
  vintage: ['vintage', 'casual'],
  street: ['street', 'casual'],
  bohemian: ['bohemian', 'casual'],
  minimalist: ['minimalist', 'casual', 'formal']
};

// ============================================
// FUNZIONI DI COMPATIBILITÀ
// ============================================

/**
 * Verifica se due colori sono compatibili
 * @param {string} color1 - Primo colore
 * @param {string} color2 - Secondo colore
 * @returns {boolean} True se i colori sono compatibili
 */
const areColorsCompatible = (color1, color2) => {
  // Stesso colore è sempre compatibile
  if (color1 === color2) return true;
  
  // Verifica nella matrice di compatibilità
  return colorCompatibility[color1]?.includes(color2) || false;
};

/**
 * Verifica se due stili sono compatibili
 * @param {string} style1 - Primo stile
 * @param {string} style2 - Secondo stile
 * @returns {boolean} True se gli stili sono compatibili
 */
const areStylesCompatible = (style1, style2) => {
  // Stesso stile è sempre compatibile
  if (style1 === style2) return true;
  
  // Verifica nella matrice di compatibilità
  return styleCompatibility[style1]?.includes(style2) || false;
};

// ============================================
// SISTEMA DI SCORING
// ============================================

/**
 * Calcola il punteggio di compatibilità di un outfit
 * Il punteggio va da 0 a 100, dove 100 è perfetto
 * 
 * Fattori considerati:
 * - Compatibilità colori (peso maggiore)
 * - Compatibilità stili
 * - Presenza di colori neutri (più versatili)
 * - Stessi colori/stili (massima coerenza)
 * 
 * @param {Object} top - Capo superiore
 * @param {Object} bottom - Capo inferiore (null se dress)
 * @param {Object} shoes - Scarpe
 * @returns {number} Punteggio da 0 a 100
 */
const calculateOutfitScore = (top, bottom, shoes) => {
  let score = 50; // Punteggio base
  
  // ===== COMPATIBILITÀ COLORI =====
  
  // Bonus per abbinamento top-bottom (se presente)
  if (top && bottom) {
    // Stesso colore = massima coerenza
    if (top.primaryColor === bottom.primaryColor) {
      score += 10;
    }
    // Colori compatibili
    else if (areColorsCompatible(top.primaryColor, bottom.primaryColor)) {
      score += 5;
    }
  }
  
  // Bonus per abbinamento con scarpe
  if (shoes && top) {
    if (areColorsCompatible(top.primaryColor, shoes.primaryColor)) {
      score += 10;
    }
  }
  
  // ===== COMPATIBILITÀ STILI =====
  
  // Bonus per stili coerenti
  if (top && bottom) {
    if (top.style === bottom.style) {
      score += 15; // Stesso stile = massima coerenza
    } else if (areStylesCompatible(top.style, bottom.style)) {
      score += 8; // Stili compatibili
    }
  }
  
  if (top && shoes) {
    if (areStylesCompatible(top.style, shoes.style)) {
      score += 10;
    }
  }
  
  // ===== BONUS VERSATILITÀ =====
  
  // Colori neutri sono più versatili e facili da abbinare
  const neutralColors = ['black', 'white', 'gray', 'beige'];
  
  if (top && neutralColors.includes(top.primaryColor)) score += 5;
  if (bottom && neutralColors.includes(bottom.primaryColor)) score += 5;
  
  // Assicura che il punteggio non superi 100
  return Math.min(score, 100);
};

// ============================================
// GENERAZIONE OUTFIT
// ============================================

/**
 * Genera outfit automatici da una collezione di capi
 * 
 * Algoritmo:
 * 1. Separa i capi per categoria
 * 2. Genera tutte le combinazioni possibili (top+bottom+shoes o dress+shoes)
 * 3. Filtra solo le combinazioni compatibili
 * 4. Calcola score per ogni outfit
 * 5. Ordina per score e restituisce i migliori 6
 * 
 * @param {Array} garments - Array di capi d'abbigliamento
 * @returns {Array} Array di outfit ordinati per score
 */
const generateOutfits = (garments) => {
  const outfits = [];
  
  // ===== STEP 1: SEPARAZIONE PER CATEGORIA =====
  const tops = garments.filter(g => g.category === 'top');
  const bottoms = garments.filter(g => g.category === 'bottom');
  const dresses = garments.filter(g => g.category === 'dress');
  const shoes = garments.filter(g => g.category === 'shoes');
  const outerwear = garments.filter(g => g.category === 'outerwear');

  // ===== STEP 2: GENERAZIONE OUTFIT TOP + BOTTOM + SHOES =====
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        // Verifica compatibilità colori
        const topBottomColorMatch = areColorsCompatible(top.primaryColor, bottom.primaryColor);
        const topShoeColorMatch = areColorsCompatible(top.primaryColor, shoe.primaryColor);
        
        // Verifica compatibilità stili
        const topBottomStyleMatch = areStylesCompatible(top.style, bottom.style);
        const topShoeStyleMatch = areStylesCompatible(top.style, shoe.style);
        
        // Crea outfit solo se compatibile
        if (topBottomColorMatch && topShoeStyleMatch && topBottomStyleMatch) {
          const outfit = {
            garments: [
              { garmentId: top._id, category: 'top' },
              { garmentId: bottom._id, category: 'bottom' },
              { garmentId: shoe._id, category: 'shoes' }
            ],
            score: calculateOutfitScore(top, bottom, shoe),
            type: 'top-bottom-shoes'
          };
          
          // Aggiungi outerwear se compatibile
          const compatibleOuterwear = outerwear.find(o => 
            areColorsCompatible(o.primaryColor, top.primaryColor) &&
            areStylesCompatible(o.style, top.style)
          );
          
          if (compatibleOuterwear) {
            outfit.garments.push({ 
              garmentId: compatibleOuterwear._id, 
              category: 'outerwear' 
            });
            outfit.score += 5; // Bonus per outfit completo
          }
          
          outfits.push(outfit);
        }
      }
    }
  }

  // ===== STEP 3: GENERAZIONE OUTFIT DRESS + SHOES =====
  for (const dress of dresses) {
    for (const shoe of shoes) {
      const colorMatch = areColorsCompatible(dress.primaryColor, shoe.primaryColor);
      const styleMatch = areStylesCompatible(dress.style, shoe.style);
      
      if (colorMatch && styleMatch) {
        const outfit = {
          garments: [
            { garmentId: dress._id, category: 'dress' },
            { garmentId: shoe._id, category: 'shoes' }
          ],
          score: calculateOutfitScore(dress, null, shoe),
          type: 'dress-shoes'
        };
        
        outfits.push(outfit);
      }
    }
  }

  // ===== STEP 4: ORDINAMENTO E SELEZIONE =====
  // Ordina per punteggio decrescente e prende i migliori 6
  return outfits
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

/**
 * Genera outfit filtrati per occasione specifica
 * @param {Array} garments - Array di capi
 * @param {string} occasion - Occasione (work, casual, party, etc.)
 * @returns {Array} Array di outfit per l'occasione
 */
const generateOutfitsByOccasion = (garments, occasion) => {
  // Filtra solo i capi adatti all'occasione
  const suitableGarments = garments.filter(g => 
    !g.occasions.length || g.occasions.includes(occasion)
  );
  
  // Genera outfit con i capi filtrati
  return generateOutfits(suitableGarments);
};

// ============================================
// EXPORT
// ============================================

module.exports = {
  generateOutfits,
  generateOutfitsByOccasion,
  areColorsCompatible,
  areStylesCompatible
};