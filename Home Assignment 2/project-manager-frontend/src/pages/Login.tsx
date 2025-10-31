import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Add CSS animations and transitions
if (typeof document !== 'undefined') {
  const styleId = 'login-page-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .login-form-panel {
        animation: fadeInScale 0.5s ease-out;
      }
      
      .login-logo-container {
        animation: fadeInScale 0.4s ease-out;
      }
      
      .login-form-container {
        animation: fadeInScale 0.6s ease-out;
      }
      
      .login-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      }
      
      .login-button:hover:not(:disabled) {
        background-color: #2563eb !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      
      .login-button {
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(style);
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Logging in with email:', email);
      const response = await authAPI.login({ email, password });
      console.log('Login successful, response:', response);
      
      if (!response.token) {
        setError('Invalid response from server - no token received');
        return;
      }
      
      login(response);
      console.log('Auth context updated, navigating to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    }}>
      {/* Centered Login Form */}
      <div style={styles.centerPanel} className="login-form-panel">
        {/* Form Container */}
        <div style={styles.formWrapper}>
          <div style={styles.formContainer} className="login-form-container">
            {/* Logo/Brand */}
            <div className="login-logo-container" style={styles.logoContainer}>
              <div style={styles.logoIcon}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              </div>
              <span style={{
                ...styles.logoText,
                color: isDarkMode ? '#f9fafb' : '#1e293b',
              }}>PathLock</span>
            </div>

            {/* Header */}
            <div style={styles.header}>
              <h1 style={{
                ...styles.title,
                color: isDarkMode ? '#f9fafb' : '#1e293b',
              }}>Login to your account</h1>
              <p style={{
                ...styles.subtitle,
                color: isDarkMode ? '#9ca3af' : '#64748b',
              }}>
                Enter your email below to login to your account
              </p>
            </div>

            {error && (
              <div style={{
                ...styles.error,
                backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2',
                color: isDarkMode ? '#fecaca' : '#991b1b',
                borderColor: isDarkMode ? '#991b1b' : '#fecaca',
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Email Field */}
              <div style={styles.field}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#1e293b',
                }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                  }}
                  placeholder="m@example.com"
                />
              </div>

              {/* Password Field */}
              <div style={styles.field}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#1e293b',
                }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="login-input"
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                  }}
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="login-button"
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Sign up link */}
              <p style={{
                ...styles.signupText,
                color: isDarkMode ? '#94a3b8' : '#64748b',
              }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{
                    ...styles.signupLink,
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                  }}
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
  },
  centerPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '400px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
  },
  formWrapper: {
    width: '100%',
  },
  formContainer: {
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    maxWidth: '280px',
  },
  error: {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#1e293b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  separatorLine: {
    flex: 1,
    height: '1px',
  },
  separatorText: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  githubButton: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  signupText: {
    fontSize: '14px',
    textAlign: 'center',
  },
  signupLink: {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },
};

export default Login;
