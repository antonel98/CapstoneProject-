// client/src/components/Dashboard.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
      setError('Errore nel caricamento delle statistiche');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5rem', color: '#2C3E50' }}>
        Caricamento statistiche... 📊
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#F8BBD9' }}>
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const categoryIcons = {
    top: '👕',
    bottom: '👖',
    dress: '👗',
    outerwear: '🧥',
    shoes: '👟',
    accessories: '👜',
    bag: '👝',
    jewelry: '💍'
  };

  const categoryNames = {
    top: 'Top',
    bottom: 'Bottom',
    dress: 'Vestiti',
    outerwear: 'Capospalla',
    shoes: 'Scarpe',
    accessories: 'Accessori',
    bag: 'Borse',
    jewelry: 'Gioielli'
  };

  const colorEmojis = {
    black: '⚫',
    white: '⚪',
    gray: '🩶',
    brown: '🤎',
    beige: '🟤',
    red: '🔴',
    pink: '🩷',
    orange: '🟠',
    yellow: '🟡',
    green: '🟢',
    blue: '🔵',
    purple: '🟣',
    navy: '🔷',
    cream: '🟨'
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2C3E50' }}>
        📊 Dashboard del Tuo Guardaroba
      </h2>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.2), rgba(176, 224, 230, 0.2))',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid rgba(248, 187, 217, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👔</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '5px' }}>
            {stats.overview.totalGarments}
          </div>
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Capi Totali</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(176, 224, 230, 0.2), rgba(248, 187, 217, 0.2))',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid rgba(176, 224, 230, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎨</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '5px' }}>
            {stats.overview.totalCategories}
          </div>
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Categorie</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.2), rgba(176, 224, 230, 0.2))',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid rgba(248, 187, 217, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌈</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '5px' }}>
            {stats.overview.totalColors}
          </div>
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Colori Diversi</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(176, 224, 230, 0.2), rgba(248, 187, 217, 0.2))',
          padding: '25px',
          borderRadius: '15px',
          border: '2px solid rgba(176, 224, 230, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⭐</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '5px' }}>
            {stats.overview.favoriteCount}
          </div>
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Preferiti</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* Distribuzione per Categoria */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid rgba(248, 187, 217, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📂 Distribuzione per Categoria
          </h3>
          
          {Object.entries(stats.byCategory).map(([category, count]) => {
            const percentage = (count / stats.overview.totalGarments * 100).toFixed(0);
            return (
              <div key={category} style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '5px',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '600', color: '#2C3E50' }}>
                    {categoryIcons[category]} {categoryNames[category]}
                  </span>
                  <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {count} ({percentage}%)
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #F8BBD9, #B0E0E6)',
                    transition: 'width 0.3s'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top 3 Colori */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid rgba(176, 224, 230, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎨 I Tuoi Colori Preferiti
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stats.topColors.map((item, idx) => (
              <div key={item.color} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                background: idx === 0 
                  ? 'linear-gradient(135deg, rgba(248, 187, 217, 0.2), rgba(176, 224, 230, 0.2))'
                  : 'rgba(248, 187, 217, 0.05)',
                borderRadius: '12px',
                border: idx === 0 ? '2px solid #F8BBD9' : '1px solid rgba(248, 187, 217, 0.2)'
              }}>
                <div style={{ 
                  fontSize: '2.5rem',
                  width: '50px',
                  textAlign: 'center'
                }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: '#2C3E50',
                    textTransform: 'capitalize',
                    marginBottom: '3px'
                  }}>
                    {colorEmojis[item.color]} {item.color}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {item.count} capi
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuzione Stagioni */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid rgba(248, 187, 217, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🌦️ Distribuzione Stagionale
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {Object.entries(stats.bySeason).map(([season, count]) => {
              const seasonEmoji = {
                'spring': '🌸',
                'summer': '☀️',
                'autumn': '🍂',
                'winter': '❄️',
                'all-season': '🌈'
              };
              const seasonName = {
                'spring': 'Primavera',
                'summer': 'Estate',
                'autumn': 'Autunno',
                'winter': 'Inverno',
                'all-season': 'Tutte'
              };
              return (
                <div key={season} style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(248, 187, 217, 0.2)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    {seasonEmoji[season]}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '3px' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    {seasonName[season]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Account */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid rgba(176, 224, 230, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ℹ️ Info Account
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              padding: '15px',
              background: 'rgba(248, 187, 217, 0.05)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#6c757d' }}>Giorni con noi:</span>
              <strong style={{ color: '#2C3E50' }}>{stats.overview.accountAge} giorni 🎉</strong>
            </div>
            
            <div style={{
              padding: '15px',
              background: 'rgba(176, 224, 230, 0.05)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#6c757d' }}>Aggiunti ultimo mese:</span>
              <strong style={{ color: '#2C3E50' }}>{stats.recentActivity.lastMonth} capi 📈</strong>
            </div>
            
            {stats.topCategory && (
              <div style={{
                padding: '15px',
                background: 'rgba(248, 187, 217, 0.05)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#6c757d' }}>Categoria preferita:</span>
                <strong style={{ color: '#2C3E50' }}>
                  {categoryIcons[stats.topCategory.category]} {categoryNames[stats.topCategory.category]} ({stats.topCategory.count})
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;