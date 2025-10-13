// server/utils/outfitMatcher.js

// Regole di compatibilità colori
const colorCompatibility = {
  black: ['white', 'gray', 'red', 'blue', 'green', 'yellow', 'pink', 'purple'],
  white: ['black', 'gray', 'blue', 'red', 'green', 'brown', 'navy', 'pink'],
  gray: ['black', 'white', 'blue', 'red', 'yellow', 'pink', 'purple'],
  blue: ['white', 'gray', 'black', 'brown', 'beige', 'yellow'],
  red: ['black', 'white', 'gray', 'beige'],
  green: ['black', 'white', 'brown', 'beige'],
  yellow: ['black', 'gray', 'blue', 'brown'],
  pink: ['black', 'white', 'gray', 'blue'],
  brown: ['white', 'beige', 'blue', 'green', 'yellow'],
  beige: ['brown', 'white', 'blue', 'red', 'green'],
  purple: ['black', 'white', 'gray'],
  navy: ['white', 'beige', 'gray']
};

// Regole di compatibilità stili
const styleCompatibility = {
  casual: ['casual', 'sport'],
  formal: ['formal', 'business'],
  sport: ['sport', 'casual'],
  business: ['business', 'formal'],
  party: ['party', 'formal'],
  vintage: ['vintage', 'casual'],
  street: ['street', 'casual']
};

// Funzione per verificare compatibilità colori
const areColorsCompatible = (color1, color2) => {
  if (color1 === color2) return true;
  return colorCompatibility[color1]?.includes(color2) || false;
};

// Funzione per verificare compatibilità stili
const areStylesCompatible = (style1, style2) => {
  if (style1 === style2) return true;
  return styleCompatibility[style1]?.includes(style2) || false;
};

// Funzione principale per generare outfit
const generateOutfits = (garments) => {
  const outfits = [];
  
  // Separa i capi per categoria
  const tops = garments.filter(g => g.category === 'top');
  const bottoms = garments.filter(g => g.category === 'bottom');
  const dresses = garments.filter(g => g.category === 'dress');
  const shoes = garments.filter(g => g.category === 'shoes');
  const outerwear = garments.filter(g => g.category === 'outerwear');
  const accessories = garments.filter(g => g.category === 'accessory');

  // Genera outfit con top + bottom + shoes
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        // Verifica compatibilità colori
        const topBottomColorMatch = areColorsCompatible(top.primaryColor, bottom.primaryColor);
        const topShoeColorMatch = areColorsCompatible(top.primaryColor, shoe.primaryColor);
        
        // Verifica compatibilità stili
        const topBottomStyleMatch = areStylesCompatible(top.style, bottom.style);
        const topShoeStyleMatch = areStylesCompatible(top.style, shoe.style);
        
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
          }
          
          outfits.push(outfit);
        }
      }
    }
  }

  // Genera outfit con dress + shoes
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

  // Ordina per punteggio e restituisci i migliori
  return outfits
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Massimo 6 outfit
};

// Calcola punteggio outfit (0-100)
const calculateOutfitScore = (top, bottom, shoes) => {
  let score = 50; // Punteggio base
  
  // Bonus per abbinamenti perfetti
  if (top && bottom) {
    if (top.primaryColor === bottom.primaryColor) score += 10;
    if (top.style === bottom.style) score += 15;
  }
  
  // Bonus scarpe
  if (shoes) {
    if (top && areColorsCompatible(top.primaryColor, shoes.primaryColor)) score += 10;
    if (top && areStylesCompatible(top.style, shoes.style)) score += 10;
  }
  
  // Bonus colori neutri (più versatili)
  const neutralColors = ['black', 'white', 'gray', 'beige'];
  if (top && neutralColors.includes(top.primaryColor)) score += 5;
  if (bottom && neutralColors.includes(bottom.primaryColor)) score += 5;
  
  return Math.min(score, 100);
};

// Genera outfit per occasione specifica
const generateOutfitsByOccasion = (garments, occasion) => {
  const suitableGarments = garments.filter(g => 
    !g.occasions.length || g.occasions.includes(occasion)
  );
  
  return generateOutfits(suitableGarments);
};

module.exports = {
  generateOutfits,
  generateOutfitsByOccasion,
  areColorsCompatible,
  areStylesCompatible
};