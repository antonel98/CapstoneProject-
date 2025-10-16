import { useState, useEffect } from 'react';
import './App.css';
import GarmentUpload from './components/GarmentUpload';
import WardrobeGallery from './components/WardrobeGallery';
import OutfitGenerator from './components/outfitgenerator';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  // Verifica se l'utente è già loggato al caricamento
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  // Se non autenticato, mostra login/register
  if (!isAuthenticated) {
    return (
      <div className="App">
        <header style={{ 
          backgroundImage: 'url(/header-bg.jpg)', 
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          padding: '40px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(122, 115, 119, 0.3)',
            zIndex: 0
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '6rem',
              fontWeight: '700',
              marginBottom: '15px',
              letterSpacing: '2px',
              fontFamily: "'Tangerine', cursive",
              color: '#6B9BD1',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              AntoFitPlanner
            </h1>
            <p style={{ 
              fontSize: '1.2rem',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto',
              color: 'white',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              Il tuo guardaroba intelligente che crea outfit perfetti
            </p>
          </div>
        </header>

        <main>
          {showLogin ? (
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setShowLogin(false)}
            />
          ) : (
            <Register 
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </main>
      </div>
    );
  }

  // Se autenticato, mostra l'app normale
  return (
    <div className="App">
      <header style={{ 
        backgroundImage: 'url(/header-bg.jpg)', 
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        padding: '40px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(122, 115, 119, 0.3)',
          zIndex: 0
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ color: 'white', fontWeight: '600' }}>
              Ciao, {user?.username}!
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#2C3E50',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>

          <h1 style={{ 
            fontSize: '6rem',
            fontWeight: '700',
            marginBottom: '15px',
            letterSpacing: '2px',
            fontFamily: "'Tangerine', cursive",
            color: '#6B9BD1',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            AntoFitPlanner
          </h1>
          <p style={{ 
            fontSize: '1.2rem',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px auto',
            color: 'white',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
          }}>
            Il tuo guardaroba intelligente che crea outfit perfetti
          </p>
          
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            flexWrap: 'wrap' 
          }}>
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'upload', label: 'Carica Capi', icon: '📷' },
              { key: 'wardrobe', label: 'Guardaroba', icon: '👔' },
              { key: 'outfits', label: 'Genera Outfit', icon: '✨' }
            ].map(btn => (
              <button 
                key={btn.key}
                onClick={() => setCurrentPage(btn.key)}
                style={{
                  padding: '15px 30px',
                  background: currentPage === btn.key 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  color: '#2C3E50',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== btn.key) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                  }
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== btn.key) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                  }
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
             
      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'upload' && <GarmentUpload />}
        {currentPage === 'wardrobe' && <WardrobeGallery />}
        {currentPage === 'outfits' && <OutfitGenerator />}
      </main>
    </div>
  );
}

export default App;