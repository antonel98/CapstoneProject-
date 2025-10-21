// client/src/components/WardrobeGallery.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './config';
import Toast from './Toast';
import Modal from './Modal';
import Loading from './Loading';

function WardrobeGallery() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Toast state
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    garmentId: null,
    garmentName: ''
  });

  useEffect(() => {
    fetchGarments();
  }, []);

  const fetchGarments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/garments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setGarments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Errore caricamento guardaroba:', error);
      setToast({ 
        message: 'Errore nel caricamento del guardaroba', 
        type: 'error' 
      });
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/garments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setToast({ message: 'Capo eliminato con successo! 🗑️', type: 'success' });
      fetchGarments();
      
    } catch (error) {
      console.error('Errore eliminazione:', error);
      setToast({ 
        message: 'Errore durante l\'eliminazione', 
        type: 'error' 
      });
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/garments/${id}/favorite`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const wasFavorite = response.data.data.isFavorite;
      setToast({ 
        message: wasFavorite ? 'Aggiunto ai preferiti! ⭐' : 'Rimosso dai preferiti', 
        type: 'success' 
      });
      
      fetchGarments();
    } catch (error) {
      console.error('Errore toggle preferito:', error);
      setToast({ 
        message: 'Errore durante l\'aggiornamento', 
        type: 'error' 
      });
    }
  };

  const openDeleteModal = (id, name) => {
    setModal({
      isOpen: true,
      garmentId: id,
      garmentName: name
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      garmentId: null,
      garmentName: ''
    });
  };

  const confirmDelete = () => {
    if (modal.garmentId) {
      handleDelete(modal.garmentId);
    }
  };

  // Filtra e ordina capi
  let filteredGarments = garments;

  if (filter !== 'all') {
    filteredGarments = filteredGarments.filter(g => g.category === filter);
  }

  if (showOnlyFavorites) {
    filteredGarments = filteredGarments.filter(g => g.isFavorite);
  }

  if (searchTerm) {
    filteredGarments = filteredGarments.filter(g => 
      g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (sortBy === 'newest') {
    filteredGarments = [...filteredGarments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortBy === 'oldest') {
    filteredGarments = [...filteredGarments].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else if (sortBy === 'favorites') {
    filteredGarments = [...filteredGarments].sort((a, b) => 
      (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
    );
  }

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
    all: 'Tutti',
    top: 'Top',
    bottom: 'Bottom',
    dress: 'Vestiti',
    outerwear: 'Capospalla',
    shoes: 'Scarpe',
    accessories: 'Accessori',
    bag: 'Borse',
    jewelry: 'Gioielli'
  };

  if (loading) {
    return <Loading message="Caricamento guardaroba..." fullScreen />;
  }

  const BACKEND_BASE = API_URL.replace('/api', '');

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notifications */}
      <Toast 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Elimina Capo"
        message={`Sei sicuro di voler eliminare questo capo? L'azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        type="danger"
      />

      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2C3E50' }}>
        👔 Il Tuo Guardaroba ({filteredGarments.length} capi)
      </h2>

      {/* Barra di ricerca e filtri */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        border: '2px solid rgba(248, 187, 217, 0.3)'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="🔍 Cerca per categoria, colore o tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '25px',
              border: '2px solid #F8BBD9',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#B0E0E6'}
            onBlur={(e) => e.target.style.borderColor = '#F8BBD9'}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              style={{
                padding: '8px 16px',
                background: showOnlyFavorites 
                  ? 'linear-gradient(45deg, #F8BBD9, #B0E0E6)' 
                  : 'white',
                border: '2px solid #F8BBD9',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                color: '#2C3E50',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ⭐ {showOnlyFavorites ? 'Tutti' : 'Solo Preferiti'}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '2px solid #F8BBD9',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2C3E50',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#B0E0E6'}
              onBlur={(e) => e.target.style.borderColor = '#F8BBD9'}
            >
              <option value="newest">📅 Più recenti</option>
              <option value="oldest">📅 Più vecchi</option>
              <option value="favorites">⭐ Preferiti prima</option>
            </select>
          </div>

          <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
            {filteredGarments.length} di {garments.length} capi
          </div>
        </div>
      </div>

      {/* Filtri categorie */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {['all', 'top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories', 'bag', 'jewelry'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '10px 20px',
              background: filter === cat 
                ? 'linear-gradient(45deg, #F8BBD9, #B0E0E6)' 
                : 'white',
              color: '#2C3E50',
              border: '2px solid #F8BBD9',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              transform: filter === cat ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (filter !== cat) e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = filter === cat ? 'scale(1.05)' : 'scale(1)';
            }}
          >
            {cat === 'all' ? '🌟 Tutti' : `${categoryIcons[cat]} ${categoryNames[cat]}`}
          </button>
        ))}
      </div>

      {/* Galleria */}
      {filteredGarments.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
          borderRadius: '20px',
          border: '2px dashed #F8BBD9'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '20px' }}>👗</p>
          <p style={{ fontSize: '1.2rem', color: '#2C3E50' }}>
            {searchTerm 
              ? `Nessun capo trovato per "${searchTerm}"` 
              : filter === 'all' && !showOnlyFavorites
                ? 'Nessun capo nel guardaroba. Inizia a caricare i tuoi vestiti!' 
                : showOnlyFavorites
                  ? 'Nessun preferito ancora. Aggiungi una stella ai tuoi capi preferiti!'
                  : `Nessun ${categoryNames[filter]} trovato`}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '25px'
        }}>
          {filteredGarments.map(garment => (
            <div
              key={garment._id}
              style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: garment.isFavorite 
                  ? '0 6px 12px rgba(248, 187, 217, 0.4)'
                  : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                border: garment.isFavorite ? '3px solid #F8BBD9' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = garment.isFavorite 
                  ? '0 6px 12px rgba(248, 187, 217, 0.4)'
                  : '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BACKEND_BASE}${garment.imageUrl}`}
                  alt={garment.category}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(garment._id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(10deg)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                >
                  {garment.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              <div style={{ padding: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span style={{ 
                    fontSize: '1.5rem',
                    background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
                    padding: '5px 10px',
                    borderRadius: '10px'
                  }}>
                    {categoryIcons[garment.category]}
                  </span>
                  <button
                    onClick={() => openDeleteModal(garment._id, categoryNames[garment.category])}
                    style={{
                      background: 'rgba(248, 187, 217, 0.3)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#F8BBD9';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(248, 187, 217, 0.3)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <p style={{ 
                  fontWeight: '600', 
                  color: '#2C3E50',
                  textTransform: 'capitalize',
                  marginBottom: '8px'
                }}>
                  {categoryNames[garment.category]}
                </p>
                
                {garment.color && (
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6c757d',
                    textTransform: 'capitalize'
                  }}>
                    Colore: {garment.color}
                  </p>
                )}
                
                {garment.season && (
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#6c757d',
                    textTransform: 'capitalize'
                  }}>
                    Stagione: {garment.season}
                  </p>
                )}
                
                {garment.tags && garment.tags.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {garment.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(176, 224, 230, 0.3)',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          marginRight: '5px',
                          marginTop: '5px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WardrobeGallery;