// server/utils/outfitMatcher.js

/**
 * ALGORITMO DI MATCHING OUTFIT
 * 
 * Questo modulo contiene la logica core per generare outfit automatici
 * basandosi su regole di compatibilità colori e stili.
 * 
 * Principi di Design:
 * - Compatibilità colori (teoria del colore)
 * - Balance dell'outfit (non troppi colori accesi)
 * - Flessibilità: dress completo, oppure top+bottom, oppure combinazioni creative
 */

/**
 * Matrice di compatibilità colori
 * Score da 0 (pessimo) a 100 (perfetto)
 */
const colorCompatibility = {
  black: { black: 70, white: 100, gray: 90, brown: 60, beige: 85, red: 80, pink: 75, orange: 60, yellow: 65, green: 70, blue: 85, purple: 80, navy: 95, cream: 90 },
  white: { black: 100, white: 70, gray: 90, brown: 80, beige: 95, red: 85, pink: 90, orange: 85, yellow: 90, green: 85, blue: 95, purple: 85, navy: 95, cream: 85 },
  gray: { black: 90, white: 90, gray: 80, brown: 70, beige: 85, red: 75, pink: 80, orange: 65, yellow: 70, green: 75, blue: 90, purple: 85, navy: 90, cream: 85 },
  brown: { black: 60, white: 80, gray: 70, brown: 75, beige: 95, red: 65, pink: 70, orange: 80, yellow: 75, green: 85, blue: 70, purple: 60, navy: 65, cream: 90 },
  beige: { black: 85, white: 95, gray: 85, brown: 95, beige: 80, red: 70, pink: 85, orange: 85, yellow: 80, green: 80, blue: 85, purple: 75, navy: 80, cream: 95 },
  red: { black: 80, white: 85, gray: 75, brown: 65, beige: 70, red: 60, pink: 65, orange: 50, yellow: 55, green: 45, blue: 70, purple: 65, navy: 80, cream: 75 },
  pink: { black: 75, white: 90, gray: 80, brown: 70, beige: 85, red: 65, pink: 70, orange: 70, yellow: 75, green: 60, blue: 80, purple: 85, navy: 75, cream: 90 },
  orange: { black: 60, white: 85, gray: 65, brown: 80, beige: 85, red: 50, pink: 70, orange: 60, yellow: 85, green: 55, blue: 70, purple: 60, navy: 65, cream: 85 },
  yellow: { black: 65, white: 90, gray: 70, brown: 75, beige: 80, red: 55, pink: 75, orange: 85, yellow: 60, green: 70, blue: 75, purple: 65, navy: 70, cream: 85 },
  green: { black: 70, white: 85, gray: 75, brown: 85, beige: 80, red: 45, pink: 60, orange: 55, yellow: 70, green: 75, blue: 70, purple: 65, navy: 75, cream: 80 },
  blue: { black: 85, white: 95, gray: 90, brown: 70, beige: 85, red: 70, pink: 80, orange: 70, yellow: 75, green: 70, blue: 80, purple: 85, navy: 90, cream: 90 },
  purple: { black: 80, white: 85, gray: 85, brown: 60, beige: 75, red: 65, pink: 85, orange: 60, yellow: 65, green: 65, blue: 85, purple: 70, navy: 80, cream: 80 },
  navy: { black: 95, white: 95, gray: 90, brown: 65, beige: 80, red: 80, pink: 75, orange: 65, yellow: 70, green: 75, blue: 90, purple: 80, navy: 85, cream: 85 },
  cream: { black: 90, white: 85, gray: 85, brown: 90, beige: 95, red: 75, pink: 90, orange: 85, yellow: 85, green: 80, blue: 90, purple: 80, navy: 85, cream: 80 },
  unknown: { black: 60, white: 60, gray: 60, brown: 60, beige: 60, red: 60, pink: 60, orange: 60, yellow: 60, green: 60, blue: 60, purple: 60, navy: 60, cream: 60 }
};

/**
 * Calcola lo score di compatibilità tra due colori
 */
function getColorScore(color1, color2) {
  const c1 = color1 || 'unknown';
  const c2 = color2 || 'unknown';
  return colorCompatibility[c1]?.[c2] || 50;
}

/**
 * Calcola lo score complessivo di un outfit
 */
function calculateOutfitScore(items) {
  if (items.length === 0) return 0;
  if (items.length === 1) return 100; // Un singolo item è sempre perfetto

  let totalScore = 0;
  let comparisons = 0;

  // Confronta ogni coppia di items
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      totalScore += getColorScore(items[i].color, items[j].color);
      comparisons++;
    }
  }

  // Bonus per outfit completi
  const categories = items.map(item => item.category);
  const hasDress = categories.includes('dress');
  const hasTop = categories.includes('top');
  const hasBottom = categories.includes('bottom');
  const hasShoes = categories.includes('shoes');
  const hasOuterwear = categories.includes('outerwear');
  const hasAccessories = categories.includes('accessories') || categories.includes('bag') || categories.includes('jewelry');

  let bonus = 0;
  
  // Bonus per outfit completi
  if (hasDress && hasShoes) bonus += 10;
  if (hasTop && hasBottom) bonus += 10;
  if (hasShoes) bonus += 5;
  if (hasOuterwear) bonus += 5;
  if (hasAccessories) bonus += 3;

  const avgScore = comparisons > 0 ? totalScore / comparisons : 100;
  return Math.min(100, Math.round(avgScore + bonus));
}

/**
 * Genera un motivo descrittivo per l'outfit
 */
function generateReason(items, score) {
  const colors = [...new Set(items.map(item => item.color).filter(c => c && c !== 'unknown'))];
  const categories = items.map(item => item.category);
  
  const hasDress = categories.includes('dress');
  const hasTop = categories.includes('top');
  const hasBottom = categories.includes('bottom');
  
  if (score >= 85) {
    if (hasDress) {
      return `Vestito elegante con abbinamenti perfetti. I colori ${colors.join(', ')} creano un look armonioso e raffinato!`;
    }
    return `Combinazione eccellente! I colori ${colors.join(', ')} si complementano perfettamente per un look impeccabile.`;
  } else if (score >= 70) {
    if (hasDress) {
      return `Vestito versatile con buoni abbinamenti. Un look bilanciato e piacevole.`;
    }
    return `Buon abbinamento di ${colors.join(' e ')}. Un outfit equilibrato e gradevole.`;
  } else {
    if (hasDress) {
      return `Look audace e creativo. Un vestito che non passa inosservato!`;
    }
    return `Combinazione interessante e originale. Perfetto per chi ama osare!`;
  }
}

/**
 * Genera outfit automatici
 * Supporta:
 * - Dress + shoes/accessories
 * - Top + Bottom + shoes/accessories
 * - Mix creativi con almeno 2 items
 */
function generateOutfits(garments, count = 5, occasion = null) {
  const outfits = [];
  const maxAttempts = count * 50; // Tentativi massimi
  let attempts = 0;

  // Raggruppa capi per categoria
  const byCategory = garments.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const dresses = byCategory.dress || [];
  const tops = byCategory.top || [];
  const bottoms = byCategory.bottom || [];
  const shoes = byCategory.shoes || [];
  const outerwear = byCategory.outerwear || [];
  const accessories = byCategory.accessories || [];
  const bags = byCategory.bag || [];
  const jewelry = byCategory.jewelry || [];

  // Combina accessori per semplificare
  const allAccessories = [...accessories, ...bags, ...jewelry];

  /**
   * STRATEGIA 1: Outfit basati su DRESS
   */
  if (dresses.length > 0) {
    for (const dress of dresses) {
      if (outfits.length >= count) break;
      
      const outfit = [dress];
      
      // Aggiungi scarpe se disponibili
      if (shoes.length > 0) {
        const bestShoe = shoes
          .map(shoe => ({ item: shoe, score: getColorScore(dress.color, shoe.color) }))
          .sort((a, b) => b.score - a.score)[0];
        outfit.push(bestShoe.item);
      }
      
      // Aggiungi capospalla se disponibile (20% probabilità)
      if (outerwear.length > 0 && Math.random() > 0.8) {
        const bestOuter = outerwear
          .map(outer => ({ item: outer, score: getColorScore(dress.color, outer.color) }))
          .sort((a, b) => b.score - a.score)[0];
        outfit.push(bestOuter.item);
      }
      
      // Aggiungi accessorio se disponibile (30% probabilità)
      if (allAccessories.length > 0 && Math.random() > 0.7) {
        const randomAccessory = allAccessories[Math.floor(Math.random() * allAccessories.length)];
        outfit.push(randomAccessory);
      }
      
      const score = calculateOutfitScore(outfit);
      if (score >= 50) { // Soglia minima
        outfits.push({
          items: outfit,
          score,
          reason: generateReason(outfit, score)
        });
      }
    }
  }

  /**
   * STRATEGIA 2: Outfit TOP + BOTTOM
   */
  if (tops.length > 0 && bottoms.length > 0) {
    while (outfits.length < count && attempts < maxAttempts) {
      attempts++;
      
      const top = tops[Math.floor(Math.random() * tops.length)];
      const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      
      // Verifica che non siano già usati insieme
      const alreadyExists = outfits.some(outfit => 
        outfit.items.some(item => item._id.equals(top._id)) &&
        outfit.items.some(item => item._id.equals(bottom._id))
      );
      
      if (alreadyExists) continue;
      
      const outfit = [top, bottom];
      
      // Aggiungi scarpe (70% probabilità)
      if (shoes.length > 0 && Math.random() > 0.3) {
        const bestShoe = shoes
          .map(shoe => ({ 
            item: shoe, 
            score: (getColorScore(top.color, shoe.color) + getColorScore(bottom.color, shoe.color)) / 2 
          }))
          .sort((a, b) => b.score - a.score)[0];
        outfit.push(bestShoe.item);
      }
      
      // Aggiungi capospalla (30% probabilità)
      if (outerwear.length > 0 && Math.random() > 0.7) {
        const randomOuter = outerwear[Math.floor(Math.random() * outerwear.length)];
        outfit.push(randomOuter);
      }
      
      // Aggiungi accessorio (40% probabilità)
      if (allAccessories.length > 0 && Math.random() > 0.6) {
        const randomAccessory = allAccessories[Math.floor(Math.random() * allAccessories.length)];
        outfit.push(randomAccessory);
      }
      
      const score = calculateOutfitScore(outfit);
      if (score >= 50) {
        outfits.push({
          items: outfit,
          score,
          reason: generateReason(outfit, score)
        });
      }
    }
  }

  /**
   * STRATEGIA 3: Combinazioni creative (se non hai abbastanza outfit)
   */
  while (outfits.length < count && attempts < maxAttempts && garments.length >= 2) {
    attempts++;
    
    // Prendi 2-4 capi casuali
    const shuffled = [...garments].sort(() => Math.random() - 0.5);
    const numItems = Math.min(Math.floor(Math.random() * 3) + 2, shuffled.length);
    const outfit = shuffled.slice(0, numItems);
    
    // Verifica che non esista già
    const alreadyExists = outfits.some(existingOutfit => 
      existingOutfit.items.length === outfit.length &&
      existingOutfit.items.every(item => outfit.some(o => o._id.equals(item._id)))
    );
    
    if (alreadyExists) continue;
    
    const score = calculateOutfitScore(outfit);
    if (score >= 45) { // Soglia più bassa per creatività
      outfits.push({
        items: outfit,
        score,
        reason: generateReason(outfit, score)
      });
    }
  }

  // Ordina per score e restituisci
  return outfits
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

module.exports = {
  generateOutfits,
  calculateOutfitScore,
  getColorScore
};