// client/src/components/GarmentUpload.jsx

import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function GarmentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('top');
  const [color, setColor] = useState('');
  const [season, setSeason] = useState('all-season');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Seleziona un\'immagine!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('category', category);
    formData.append('color', color);
    formData.append('season', season);
    formData.append('tags', tags);

    try {
      // Recupera il token dal localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/garments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Invia il token
        }
      });

      setMessage({ type: 'success', text: response.data.message });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCategory('top');
      setColor('');
      setSeason('all-season');
      setTags('');
      document.getElementById('fileInput').value = '';

    } catch (error) {
      console.error('Errore upload:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Errore durante l\'upload' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2C3E50' }}>
        📷 Carica un Nuovo Capo
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Upload Immagine */}
        <div style={{
          border: '2px dashed #F8BBD9',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.05), rgba(176, 224, 230, 0.05))'
        }}>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="fileInput"
            style={{
              cursor: 'pointer',
              display: 'inline-block',
              padding: '15px 30px',
              background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
              color: '#2C3E50',
              borderRadius: '25px',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}
          >
            Scegli Immagine
          </label>
          
          {preview && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C3E50' }}>
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #F8BBD9'
            }}
          >
            <option value="top">👕 Top</option>
            <option value="bottom">👖 Bottom</option>
            <option value="dress">👗 Vestito</option>
            <option value="outerwear">🧥 Capospalla</option>
            <option value="shoes">👟 Scarpe</option>
            <option value="accessories">👜 Accessori</option>
            <option value="bag">👝 Borse</option>
            <option value="jewelry">💍 Gioielli</option>
          </select>
        </div>

        {/* Colore */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C3E50' }}>
            Colore Principale
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="form-control"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #F8BBD9'
            }}
          >
            <option value="">Seleziona colore</option>
            <option value="black">⚫ Nero</option>
            <option value="white">⚪ Bianco</option>
            <option value="gray">🩶 Grigio</option>
            <option value="brown">🤎 Marrone</option>
            <option value="beige">🟤 Beige</option>
            <option value="red">🔴 Rosso</option>
            <option value="pink">🩷 Rosa</option>
            <option value="orange">🟠 Arancione</option>
            <option value="yellow">🟡 Giallo</option>
            <option value="green">🟢 Verde</option>
            <option value="blue">🔵 Blu</option>
            <option value="purple">🟣 Viola</option>
            <option value="navy">🔷 Navy</option>
            <option value="cream">🟨 Crema</option>
          </select>
        </div>

        {/* Stagione */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C3E50' }}>
            Stagione
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="form-control"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #F8BBD9'
            }}
          >
            <option value="all-season">🌈 Tutte le stagioni</option>
            <option value="spring">🌸 Primavera</option>
            <option value="summer">☀️ Estate</option>
            <option value="autumn">🍂 Autunno</option>
            <option value="winter">❄️ Inverno</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C3E50' }}>
            Tag (separati da virgola)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="es: casual, comodo, preferito"
            className="form-control"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '2px solid #F8BBD9'
            }}
          />
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
            fontWeight: '600'
          }}>
            {message.text}
          </div>
        )}

        {/* Pulsante Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px',
            background: loading 
              ? '#ccc' 
              : 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
            color: '#2C3E50',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          {loading ? 'Caricamento...' : '✨ Carica Capo'}
        </button>
      </form>
    </div>
  );
}

export default GarmentUpload;