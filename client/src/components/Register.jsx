import { useState } from 'react';
import axios from 'axios';
import API_URL from './config';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validazione password
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Salva token nel localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      // Callback successo
      onRegisterSuccess(response.data.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '400px',
      margin: '50px auto',
      background: 'linear-gradient(45deg, rgba(248, 187, 217, 0.1), rgba(176, 224, 230, 0.1))',
      borderRadius: '20px',
      border: '1px solid rgba(248, 187, 217, 0.3)'
    }}>
      <h2 style={{ 
        textAlign: 'center',
        marginBottom: '30px',
        color: '#2C3E50'
      }}>
        Registrati ad AntoFitPlanner
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Il tuo username"
            minLength="3"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="tua@email.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Almeno 6 caratteri"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Conferma Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ripeti la password"
          />
        </div>

        {error && (
          <div style={{ 
            padding: '12px',
            backgroundColor: 'rgba(248, 187, 217, 0.2)',
            border: '1px solid #F8BBD9',
            borderRadius: '8px',
            color: '#721c24',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '15px',
            background: loading ? '#ccc' : 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
            color: '#2C3E50',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registrazione in corso...' : 'Registrati'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
        Hai già un account?{' '}
        <span 
          onClick={onSwitchToLogin}
          style={{ 
            color: '#F8BBD9',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Accedi
        </span>
      </p>
    </div>
  );
}

export default Register;