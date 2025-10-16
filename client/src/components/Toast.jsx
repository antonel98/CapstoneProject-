// client/src/components/Toast.jsx

import { useEffect } from 'react';

function Toast({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      background: 'linear-gradient(135deg, #B0E0E6, #90EE90)',
      icon: '✓',
      border: '2px solid #B0E0E6'
    },
    error: {
      background: 'linear-gradient(135deg, #F8BBD9, #FFA07A)',
      icon: '✗',
      border: '2px solid #F8BBD9'
    },
    info: {
      background: 'linear-gradient(135deg, #F8BBD9, #B0E0E6)',
      icon: 'ℹ',
      border: '2px solid #F8BBD9'
    },
    warning: {
      background: 'linear-gradient(135deg, #FFD700, #FFA07A)',
      icon: '⚠',
      border: '2px solid #FFD700'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px',
        padding: '16px 20px',
        background: style.background,
        border: style.border,
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-in ' + (duration - 300) + 'ms forwards',
        color: '#2C3E50',
        fontWeight: '600',
        fontSize: '15px'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        {style.icon}
      </div>
      
      <div style={{ flex: 1 }}>
        {message}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#2C3E50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.7)'}
      >
        ×
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;