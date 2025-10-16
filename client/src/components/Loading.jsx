// client/src/components/Loading.jsx

function Loading({ message = "Caricamento...", fullScreen = false }) {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    zIndex: 9997,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(5px)'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px'
  };

  return (
    <div style={containerStyle}>
      {/* Spinner */}
      <div
        style={{
          width: '80px',
          height: '80px',
          border: '6px solid rgba(248, 187, 217, 0.2)',
          borderTop: '6px solid #F8BBD9',
          borderRight: '6px solid #B0E0E6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}
      />

      {/* Message */}
      <p
        style={{
          fontSize: '1.2rem',
          color: '#2C3E50',
          fontWeight: '600',
          margin: '0',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      >
        {message}
      </p>

      {/* Dots animation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '15px'
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Loading;