import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      minWidth: '320px',
      maxWidth: '500px',
      padding: '16px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease-out',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    };

    const typeStyles: { [key: string]: React.CSSProperties } = {
      success: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '1px solid #a7f3d0',
      },
      error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
      },
      info: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
    };
    return icons[type];
  };

  return (
    <>
      <style>
        {`
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
          
          @media (max-width: 640px) {
            .toast {
              min-width: 280px !important;
              right: 16px !important;
              bottom: 16px !important;
            }
          }
        `}
      </style>
      <div className="toast" style={getStyles()}>
        <span style={{ fontSize: '24px' }}>{getIcon()}</span>
        <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0.6,
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;
