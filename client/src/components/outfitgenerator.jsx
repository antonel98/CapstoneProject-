// client/src/components/outfitgenerator.jsx

import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function OutfitGenerator() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);
  const [occasion, setOccasion] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const generateOutfits = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    setOutfits([]);

    try {
      // Recupera il token dal localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/outfits/generate`,
        { count, occasion },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Invia il token
            'Content-Type': 'application/json'
          }
        }
      );

      setOutfits(response.data.data);
      setMessage({ 
        type: 'success', 
        text: response.data.message 
      });

    } catch (error) {
      console.error('Errore generazione outfit:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.response?.data?.hint || 'Errore durante la generazione' 
      });
    } finally {
      setLoading(false);
    }
  };

  const BACKEND_BASE = API_URL.replace('/api', '');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2C3E50' }}>
        ✨ Genera Outfit Automatici
      </h2>

      {/* Controlli */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
        padding: '30px',
        borderRadius: '20px',
        marginBottom: '40px',
        border: '2px solid rgba(248, 187, 217, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#2C3E50'
            }}>
              Numero di Outfit
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #F8BBD9',
                width: '150px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#2C3E50'
            }}>
              Occasione (opzionale)
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #F8BBD9',
                width: '200px',
                fontSize: '16px'
              }}
            >
              <option value="">Qualsiasi</option>
              <option value="casual">👕 Casual</option>
              <option value="formal">👔 Formale</option>
              <option value="sport">🏃 Sportivo</option>
              <option value="party">🎉 Festa</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateOutfits}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: loading 
              ? '#ccc' 
              : 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
            color: '#2C3E50',
            border: 'none',
            borderRadius: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {loading ? '🔄 Generazione in corso...' : '✨ Genera Outfit Magici'}
        </button>
      </div>

      {/* Messaggio */}
      {message.text && (
        <div style={{
          padding: '15px',
          borderRadius: '10px',
          background: message.type === 'success' 
            ? 'rgba(176, 224, 230, 0.2)' 
            : 'rgba(248, 187, 217, 0.2)',
          border: `2px solid ${message.type === 'success' ? '#B0E0E6' : '#F8BBD9'}`,
          color: '#2C3E50',
          fontWeight: '600',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      {/* Outfit Generati */}
      {outfits.length > 0 && (
        <div>
          <h3 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            color: '#2C3E50',
            fontSize: '1.5rem'
          }}>
            🎨 I Tuoi Outfit Perfetti
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {outfits.map((outfit, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '2px solid rgba(248, 187, 217, 0.3)',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ 
                    margin: 0,
                    color: '#2C3E50',
                    fontSize: '1.2rem'
                  }}>
                    Outfit #{idx + 1}
                  </h4>
                  <div style={{
                    background: outfit.score >= 80 
                      ? 'linear-gradient(45deg, #B0E0E6, #90EE90)' 
                      : outfit.score >= 60 
                        ? 'linear-gradient(45deg, #F8BBD9, #FFD700)'
                        : 'linear-gradient(45deg, #F8BBD9, #FFA07A)',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontWeight: 'bold',
                    color: '#2C3E50'
                  }}>
                    {outfit.score >= 80 ? '⭐' : outfit.score >= 60 ? '✨' : '💫'} {outfit.score}%
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  {outfit.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={`${BACKEND_BASE}${item.imageUrl}`}
                        alt={item.category}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {item.category}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '12px',
                  background: 'rgba(248, 187, 217, 0.1)',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}>
                  <strong>Perché funziona:</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
                    {outfit.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OutfitGenerator;