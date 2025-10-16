// server/controllers/statsController.js

/**
 * Controller per le statistiche utente
 * Fornisce dati aggregati su capi, outfit e utilizzo
 */

const Garment = require('../models/Garment');
const User = require('../models/User');

/**
 * @desc    Recupera statistiche complete dell'utente
 * @route   GET /api/stats
 * @access  Private
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Recupera utente
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Recupera tutti i capi dell'utente
    const garments = await Garment.find({ userId });

    // Calcola statistiche per categoria
    const categoryStats = garments.reduce((acc, garment) => {
      acc[garment.category] = (acc[garment.category] || 0) + 1;
      return acc;
    }, {});

    // Calcola statistiche per colore
    const colorStats = garments.reduce((acc, garment) => {
      const color = garment.color || 'unknown';
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {});

    // Calcola statistiche per stagione
    const seasonStats = garments.reduce((acc, garment) => {
      const season = garment.season || 'all-season';
      acc[season] = (acc[season] || 0) + 1;
      return acc;
    }, {});

    // Top 3 colori più usati
    const topColors = Object.entries(colorStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color, count]) => ({ color, count }));

    // Categoria più popolata
    const topCategory = Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])[0];

    // Capi preferiti (se implementato)
    const favorites = garments.filter(g => g.isFavorite);

    // Capi più usati negli outfit
    const mostUsed = garments
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 5);

    // Calcola valore totale guardaroba (se hanno inserito prezzi)
    const totalValue = garments.reduce((sum, g) => sum + (g.price || 0), 0);

    // Statistiche temporali
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const recentGarments = garments.filter(g => new Date(g.createdAt) > oneMonthAgo);

    res.json({
      success: true,
      data: {
        overview: {
          totalGarments: garments.length,
          totalCategories: Object.keys(categoryStats).length,
          totalColors: Object.keys(colorStats).length,
          favoriteCount: favorites.length,
          totalValue: totalValue,
          accountAge: Math.floor((Date.now() - new Date(user.stats.joinDate)) / (1000 * 60 * 60 * 24)) // giorni
        },
        byCategory: categoryStats,
        byColor: colorStats,
        bySeason: seasonStats,
        topColors: topColors,
        topCategory: topCategory ? { category: topCategory[0], count: topCategory[1] } : null,
        favorites: favorites.map(g => ({
          id: g._id,
          category: g.category,
          color: g.color,
          imageUrl: g.imageUrl
        })),
        mostUsed: mostUsed.map(g => ({
          id: g._id,
          category: g.category,
          color: g.color,
          imageUrl: g.imageUrl,
          usageCount: g.usageCount || 0
        })),
        recentActivity: {
          lastMonth: recentGarments.length,
          lastAdded: garments.length > 0 ? garments[garments.length - 1].createdAt : null
        }
      }
    });

  } catch (error) {
    console.error('Errore recupero statistiche:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero delle statistiche',
      error: error.message
    });
  }
};

/**
 * @desc    Recupera statistiche per categoria specifica
 * @route   GET /api/stats/category/:category
 * @access  Private
 */
const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;

    const garments = await Garment.find({ userId, category });

    const colorDistribution = garments.reduce((acc, g) => {
      const color = g.color || 'unknown';
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        category,
        total: garments.length,
        colors: colorDistribution,
        items: garments.map(g => ({
          id: g._id,
          color: g.color,
          season: g.season,
          imageUrl: g.imageUrl,
          usageCount: g.usageCount || 0
        }))
      }
    });

  } catch (error) {
    console.error('Errore recupero statistiche categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero delle statistiche',
      error: error.message
    });
  }
};

module.exports = {
  getUserStats,
  getCategoryStats
};