interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#ff6b35',
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizes = {
    small: 24,
    medium: 48,
    large: 64,
  };

  const spinnerSize = sizes[size];

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div
          style={{
            width: `${spinnerSize}px`,
            height: `${spinnerSize}px`,
            border: `4px solid rgba(0, 0, 0, 0.1)`,
            borderTop: `4px solid ${color}`,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    </>
  );
};

export default LoadingSpinner;
