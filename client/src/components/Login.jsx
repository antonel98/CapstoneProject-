import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Salva token nel localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      // Callback successo
      onLoginSuccess(response.data.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
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
        Accedi ad AntoFitPlanner
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            placeholder="••••••••"
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
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
        Non hai un account?{' '}
        <span 
          onClick={onSwitchToRegister}
          style={{ 
            color: '#F8BBD9',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Registrati
        </span>
      </p>
    </div>
  );
}

export default Login;