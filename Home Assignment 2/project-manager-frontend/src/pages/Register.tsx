import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3 || username.length > 30) {
      setError('Username must be between 3 and 30 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({ username, email, password });
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.pageContainer,
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    }}>
      <div style={styles.centerContainer} className="register-form-panel">
        {/* Register Form */}
        <div style={styles.formSection}>
          <div style={styles.formHeader}>
            <Link to="/" style={styles.logoLink}>
              <div style={{
                ...styles.logoIcon,
                backgroundColor: isDarkMode ? '#3b82f6' : '#3b82f6',
              }}>
                📁
              </div>
              <span style={{
                ...styles.logoText,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
              }}>PathLock</span>
            </Link>
          </div>

          <div style={styles.formContainer}>
            <div style={styles.formWrapper}>
              <div style={styles.formTitleSection}>
                <h1 style={{
                  ...styles.formTitle,
                  color: isDarkMode ? '#f8fafc' : '#0f172a',
                }}>Create an account</h1>
                <p style={{
                  ...styles.formSubtitle,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                }}>
                  Enter your details below to create your account
                </p>
              </div>

              {error && (
                <div style={styles.errorAlert}>
                  <span style={styles.errorIcon}>⚠️</span>
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={{
                    ...styles.fieldLabel,
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={30}
                    style={{
                      ...styles.fieldInput,
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                    placeholder="Enter your username"
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={{
                    ...styles.fieldLabel,
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      ...styles.fieldInput,
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                    placeholder="m@example.com"
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={{
                    ...styles.fieldLabel,
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      ...styles.fieldInput,
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                    placeholder="Enter your password"
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={{
                    ...styles.fieldLabel,
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      ...styles.fieldInput,
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                    placeholder="Confirm your password"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>

              <p style={{
                ...styles.footerText,
                color: isDarkMode ? '#94a3b8' : '#64748b',
              }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{
                    ...styles.footerLink,
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                  }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleId = 'register-page-styles';
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
      
      .register-form-panel {
        animation: fadeInScale 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
  },
  centerContainer: {
    width: '100%',
    maxWidth: '400px',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  formWrapper: {
    width: '100%',
  },
  formTitleSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  formSubtitle: {
    fontSize: '14px',
    margin: 0,
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  errorText: {
    fontSize: '14px',
    color: '#991b1b',
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  fieldInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
  },
  dividerText: {
    fontSize: '13px',
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
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  githubIcon: {
    width: '20px',
    height: '20px',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '16px',
  },
  footerLink: {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },
};

export default Register;
