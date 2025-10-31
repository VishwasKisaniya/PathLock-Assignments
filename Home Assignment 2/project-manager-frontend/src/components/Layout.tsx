import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { profileAPI } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProfileImage();
  }, [location.pathname]); // Refetch when route changes

  const fetchProfileImage = async () => {
    try {
      const profile = await profileAPI.get();
      if (profile.profileImageUrl) {
        setProfileImageUrl(profile.profileImageUrl);
      }
    } catch (err) {
      // Silently fail - user might not have profile image
      console.error('Failed to fetch profile image');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const userName = user?.username || localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'User';

  const themeColors = {
    container: { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
    sidebar: { backgroundColor: isDarkMode ? '#0f1419' : '#1e293b' },
    header: { 
      backgroundColor: isDarkMode ? '#1f2937' : 'white',
      borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb',
    },
    pageTitle: { color: isDarkMode ? '#f9fafb' : '#1f2937' },
    userName: { color: isDarkMode ? '#f9fafb' : '#1f2937' },
    userRole: { color: isDarkMode ? '#9ca3af' : '#6b7280' },
    content: { backgroundColor: isDarkMode ? '#111827' : '#f9fafb' },
    profileMenu: {
      backgroundColor: isDarkMode ? '#1f2937' : 'white',
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
    },
    profileMenuItem: { color: isDarkMode ? '#f9fafb' : '#1f2937' },
  };

  return (
    <div style={{ ...styles.container, ...themeColors.container }}>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          style={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        ...styles.sidebar, 
        ...themeColors.sidebar,
        ...(isMobile ? {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        } : {}),
      }}>
        {/* Close button for mobile */}
        {isMobile && (
          <button 
            style={styles.closeSidebarBtn}
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        )}

        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
          <img src="/pathlock-logo.svg" alt="PathLock" style={styles.logoImage} />
          <span style={styles.logoText}>PathLock</span>
        </div>

        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navItem,
              ...(isActive('/dashboard') ? styles.navItemActive : {}),
            }}
            onClick={() => {
              navigate('/dashboard');
              if (isMobile) setIsSidebarOpen(false);
            }}
          >
            <span style={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            style={{
              ...styles.navItem,
              ...(isActive('/projects') ? styles.navItemActive : {}),
            }}
            onClick={() => {
              navigate('/projects');
              if (isMobile) setIsSidebarOpen(false);
            }}
          >
            <span style={styles.navIcon}>📁</span>
            <span>Projects</span>
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.createProjectBtn} onClick={() => {
            navigate('/dashboard?create=true');
            if (isMobile) setIsSidebarOpen(false);
          }}>
            + Create New Project
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        ...styles.mainContent,
        ...(isMobile ? { marginLeft: 0 } : {}),
      }}>
        {/* Top Navigation Bar */}
        <header style={{ ...styles.header, ...themeColors.header }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isMobile && (
              <button
                style={styles.hamburgerBtn}
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
            )}
            <h1 style={{ 
              ...styles.pageTitle, 
              ...themeColors.pageTitle,
              ...(isMobile ? { fontSize: '18px' } : {}),
            }}>
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/projects' && 'Projects'}
              {location.pathname.startsWith('/projects/') && 'Project Details'}
            </h1>
          </div>

          <div style={styles.headerRight}>
            <button
              onClick={toggleTheme}
              style={{
                ...styles.themeToggle,
                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                color: isDarkMode ? '#f9fafb' : '#1f2937',
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div style={styles.userInfo}>
              <span style={{ ...styles.userName, ...themeColors.userName }}>{userName}</span>
              <span style={{ ...styles.userRole, ...themeColors.userRole }}>{userRole}</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                style={{
                  ...styles.profileBtn,
                  ...(profileImageUrl ? { padding: 0, overflow: 'hidden' } : {}),
                }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </button>
              {showProfileMenu && (
                <div style={{ ...styles.profileMenu, ...themeColors.profileMenu }}>
                  <button 
                    style={{
                      ...styles.profileMenuItem,
                      ...themeColors.profileMenuItem,
                      ...(hoveredMenuItem === 'profile' ? { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' } : {}),
                    }}
                    onMouseEnter={() => setHoveredMenuItem('profile')}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                  >
                    👤 My Profile
                  </button>
                  <button 
                    style={{
                      ...styles.profileMenuItem,
                      ...themeColors.profileMenuItem,
                      ...(hoveredMenuItem === 'logout' ? { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' } : {}),
                    }}
                    onMouseEnter={() => setHoveredMenuItem('logout')}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ ...styles.content, ...themeColors.content }}>{children}</main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  logo: {
    padding: '24px 20px',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logoImage: {
    width: '32px',
    height: '32px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s',
    textAlign: 'left',
    width: '100%',
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    borderLeft: '3px solid #3b82f6',
  },
  navIcon: {
    fontSize: '18px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  createProjectBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'white',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'none',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  userRole: {
    fontSize: '12px',
    color: '#64748b',
  },
  profileBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  profileMenu: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '180px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  profileMenuItem: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#1e293b',
    transition: 'background-color 0.2s, color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profileMenuItemHover: {
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 16px',
  },
  themeToggle: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.2s',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  hamburgerBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeSidebarBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    zIndex: 10,
  },
};

export default Layout;
