// client/src/components/GarmentUpload.jsx
import { useState } from 'react';
import axios from 'axios';

function GarmentUpload() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'top',
    primaryColor: 'black',
    style: 'casual'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage('Seleziona un\'immagine!');
      return;
    }

    setLoading(true);
    const uploadData = new FormData();
    
    uploadData.append('image', selectedFile);
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/garments', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Capo caricato con successo!');
      console.log('Response:', response.data);
      
      setFormData({
        name: '',
        category: 'top',
        primaryColor: 'black',
        style: 'casual'
      });
      setSelectedFile(null);
      e.target.reset();

    } catch (error) {
      console.error('Errore:', error);
      setMessage((error.response?.data?.message || 'Errore nel caricamento'));
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div style={{ 
        background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid rgba(248, 187, 217, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#2C3E50',
          marginBottom: '10px',
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Carica Nuovo Capo
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#495057',
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Aggiungi un capo al tuo guardaroba digitale
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#2C3E50'
            }}>
              📸 Immagine del capo
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
              className="form-control"
              style={{ 
                background: 'white',
                border: '2px dashed #F8BBD9',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
              👕 Nome (opzionale)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Es: Maglia blu preferita"
              className="form-control"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#2C3E50'
              }}>
                📂 Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="top">👕 Top</option>
                <option value="bottom">👖 Bottom</option>
                <option value="dress">👗 Dress</option>
                <option value="shoes">👠 Shoes</option>
                <option value="outerwear">🧥 Outerwear</option>
                <option value="accessory">👜 Accessory</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#2C3E50'
              }}>
                🎨 Colore
              </label>
              <select
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="black">⚫ Black</option>
                <option value="white">⚪ White</option>
                <option value="gray">🔘 Gray</option>
                <option value="blue">🔵 Blue</option>
                <option value="red">🔴 Red</option>
                <option value="green">🟢 Green</option>
                <option value="yellow">🟡 Yellow</option>
                <option value="pink">🩷 Pink</option>
                <option value="purple">🟣 Purple</option>
                <option value="brown">🤎 Brown</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#2C3E50'
            }}>
              ✨ Stile
            </label>
            <select
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="casual">👕 Casual</option>
              <option value="formal">🤵 Formal</option>
              <option value="sport">🏃 Sport</option>
              <option value="business">💼 Business</option>
              <option value="party">🎉 Party</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              padding: '15px',
              fontSize: '16px',
              marginTop: '10px',
              background: loading ? '#ccc' : 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
              border: 'none',
              borderRadius: '25px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold',
              color: '#2C3E50'
            }}
          >
            {loading ? '⏳ Caricamento...' : '🚀 Carica Capo'}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '25px', 
            padding: '15px', 
            backgroundColor: message.includes('successo') ? 
              'rgba(176, 224, 230, 0.2)' : 
              'rgba(248, 187, 217, 0.2)',
            border: `1px solid ${message.includes('successo') ? '#B0E0E6' : '#F8BBD9'}`,
            borderRadius: '10px',
            textAlign: 'center',
            fontWeight: '600',
            color: '#2C3E50'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default GarmentUpload;