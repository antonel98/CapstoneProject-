// client/src/components/OutfitGenerator.jsx
import { useState } from 'react';
import axios from 'axios';

function OutfitGenerator() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    occasion: '',
    style: ''
  });

  const generateOutfits = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/outfits/generate', filters);
      setOutfits(response.data.data);
    } catch (error) {
      console.error('Errore generazione outfit:', error);
      alert('Errore nella generazione degli outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        <h2 style={{ 
          fontSize: '2rem',
          marginBottom: '10px',
          background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Generatore di Outfit
        </h2>
        <p style={{ 
          color: '#495057',
          fontSize: '1.1rem'
        }}>
          Lascia che l'AI crei outfit perfetti con i tuoi capi!
        </p>
      </div>

      {/* Filtri */}
      <div className="filter-section">
        <h3 style={{ 
          marginBottom: '20px',
          color: '#2C3E50',
          fontSize: '1.2rem'
        }}>
          Personalizza i tuoi outfit
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <select 
            name="occasion" 
            value={filters.occasion} 
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Qualsiasi occasione</option>
            <option value="work">Lavoro</option>
            <option value="casual">Casual</option>
            <option value="party">Festa</option>
            <option value="formal">Formale</option>
            <option value="date">Appuntamento</option>
          </select>

          <select 
            name="style" 
            value={filters.style} 
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Qualsiasi stile</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sport">Sport</option>
            <option value="business">Business</option>
            <option value="party">Party</option>
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={generateOutfits}
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              background: loading ? '#ccc' : 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
              border: 'none',
              borderRadius: '25px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              color: '#2C3E50',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '🔄 Generando...' : '✨ Genera Outfit'}
          </button>
        </div>
      </div>

      {/* Risultati */}
      {outfits.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
          borderRadius: '20px',
          border: '1px solid rgba(248, 187, 217, 0.3)',
          color: '#6c757d'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Clicca "Genera Outfit" per vedere i tuoi abbinamenti!
          </p>
          <p>L'AI analizzerà i tuoi capi e creerà combinazioni perfette</p>
        </div>
      )}

      {/* Grid degli outfit */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
        gap: '30px' 
      }}>
        {outfits.map((outfit, index) => (
          <div key={index} className="card" style={{
            background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.05), rgba(176, 224, 230, 0.05))',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            padding: '25px'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#2C3E50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1.2rem'
            }}>
              Outfit #{index + 1}
              <span style={{
                fontSize: '14px',
                background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
                color: '#2C3E50',
                padding: '6px 12px',
                borderRadius: '15px',
                fontWeight: '600'
              }}>
                Score: {outfit.score}
              </span>
            </h3>
            
            {/* Capi dell'outfit */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              {outfit.garments.map((garment, gIndex) => (
                <div key={gIndex} style={{
                  textAlign: 'center',
                  background: 'white',
                  borderRadius: '10px',
                  padding: '15px',
                  border: '1px solid rgba(248, 187, 217, 0.2)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img 
                    src={`http://localhost:5000${garment.details.imageUrl}`}
                    alt={garment.details.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                  />
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#2C3E50',
                    marginBottom: '5px'
                  }}>
                    {garment.details.name}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#6c757d',
                    textTransform: 'capitalize'
                  }}>
                    {garment.details.category}
                  </div>
                </div>
              ))}
            </div>

            {/* Info outfit */}
            <div style={{ 
              fontSize: '13px', 
              color: '#6c757d',
              borderTop: '1px solid rgba(248, 187, 217, 0.3)',
              paddingTop: '15px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div><strong>Tipo:</strong> {outfit.type}</div>
              <div><strong>Compatibilità:</strong> {outfit.score}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutfitGenerator;