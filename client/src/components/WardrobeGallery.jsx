// client/src/components/WardrobeGallery.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function WardrobeGallery() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    color: '',
    style: ''
  });

  useEffect(() => {
    fetchGarments();
  }, [filter]);

  const fetchGarments = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.color) params.append('color', filter.color);
      if (filter.style) params.append('style', filter.style);

      const response = await axios.get(`http://localhost:5000/api/garments?${params}`);
      setGarments(response.data.data);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const deleteGarment = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo capo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/garments/${id}`);
        setGarments(garments.filter(g => g._id !== id));
      } catch (error) {
        console.error('Errore nell\'eliminazione:', error);
      }
    }
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      color: '#2C3E50',
      fontSize: '1.2rem'
    }}>
      Caricamento guardaroba...
    </div>
  );

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
          Il Mio Guardaroba
        </h2>
        <p style={{ 
          color: '#495057',
          fontSize: '1.1rem'
        }}>
          {garments.length} capi nella tua collezione
        </p>
      </div>
      
      {/* Filtri */}
      <div className="filter-section">
        <h3 style={{ 
          marginBottom: '20px',
          color: '#2C3E50',
          fontSize: '1.2rem'
        }}>
          Filtra i tuoi capi
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <select 
            name="category" 
            value={filter.category} 
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Tutte le categorie</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="dress">Dress</option>
            <option value="shoes">Shoes</option>
            <option value="outerwear">Outerwear</option>
            <option value="accessory">Accessory</option>
          </select>

          <select 
            name="color" 
            value={filter.color} 
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Tutti i colori</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="gray">Gray</option>
          </select>

          <select 
            name="style" 
            value={filter.style} 
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Tutti gli stili</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sport">Sport</option>
            <option value="business">Business</option>
            <option value="party">Party</option>
          </select>
        </div>
      </div>

      {/* Grid dei capi */}
      {garments.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
          borderRadius: '20px',
          border: '1px solid rgba(248, 187, 217, 0.3)'
        }}>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#495057',
            marginBottom: '20px'
          }}>
            Nessun capo trovato
          </p>
          <p style={{ color: '#6c757d' }}>
            Carica il tuo primo capo per iniziare!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
        }}>
          {garments.map(garment => (
            <div 
              key={garment._id} 
              className="card"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              {/* Immagine */}
              <div style={{ 
                height: '220px', 
                overflow: 'hidden',
                background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))'
              }}>
                <img 
                  src={`http://localhost:5000${garment.imageUrl}`}
                  alt={garment.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>
              
              {/* Info capo */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '1.1rem',
                  color: '#2C3E50',
                  fontWeight: '600'
                }}>
                  {garment.name}
                </h3>
                
                <div style={{ 
                  fontSize: '14px', 
                  color: '#6c757d', 
                  marginBottom: '15px',
                  lineHeight: '1.6'
                }}>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>Categoria:</span> {garment.category}
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>Colore:</span> {garment.primaryColor}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Stile:</span> {garment.style}
                  </div>
                </div>
                
                {/* Azioni */}
                <button
                  onClick={() => deleteGarment(garment._id)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
                    color: '#2C3E50',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WardrobeGallery;