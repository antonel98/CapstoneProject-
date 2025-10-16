// client/src/components/Modal.jsx

function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = "Conferma", cancelText = "Annulla", type = "danger" }) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      confirmBg: 'linear-gradient(45deg, #F8BBD9, #FFA07A)',
      icon: '⚠️'
    },
    success: {
      confirmBg: 'linear-gradient(45deg, #B0E0E6, #90EE90)',
      icon: '✓'
    },
    warning: {
      confirmBg: 'linear-gradient(45deg, #FFD700, #FFA07A)',
      icon: '⚠'
    },
    info: {
      confirmBg: 'linear-gradient(45deg, #F8BBD9, #B0E0E6)',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
          backdropFilter: 'blur(3px)'
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: '4rem',
            textAlign: 'center',
            marginBottom: '20px',
            animation: 'bounce 0.5s ease-out'
          }}
        >
          {style.icon}
        </div>

        {/* Title */}
        <h3
          style={{
            margin: '0 0 15px 0',
            fontSize: '1.5rem',
            color: '#2C3E50',
            textAlign: 'center',
            fontWeight: '700'
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            margin: '0 0 30px 0',
            fontSize: '1rem',
            color: '#6c757d',
            textAlign: 'center',
            lineHeight: '1.5'
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: '#6c757d',
              transition: 'all 0.2s',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.borderColor = '#d0d0d0';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '12px 30px',
              background: style.confirmBg,
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              color: '#2C3E50',
              transition: 'all 0.2s',
              minWidth: '120px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            transform: translate(-50%, -50%) scale(0.7);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}

export default Modal;