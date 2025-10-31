import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyResources } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const Resources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredResources = statusFilter === 'all'
    ? dummyResources
    : dummyResources.filter(r => r.status === statusFilter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'busy':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'on-leave':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 60) return '#10b981';
    if (availability >= 30) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📊</div>
          <span style={styles.logoText}>Promage</span>
        </div>

        <button style={styles.createButton}>
          <span style={styles.plusIcon}>+</span>
          Add new resource
        </button>

        <nav style={styles.nav}>
          <button style={styles.navItem} onClick={() => navigate('/dashboard')}>
            <span style={styles.navIcon}>📊</span>
            Dashboard
          </button>
          <button style={styles.navItem} onClick={() => navigate('/projects')}>
            <span style={styles.navIcon}>📁</span>
            Projects
          </button>
          <button style={styles.navItem} onClick={() => navigate('/tasks')}>
            <span style={styles.navIcon}>✓</span>
            Tasks
          </button>
          <button style={styles.navItem} onClick={() => navigate('/time-log')}>
            <span style={styles.navIcon}>⏰</span>
            Time log
          </button>
          <button style={styles.navItemActive} onClick={() => navigate('/resources')}>
            <span style={styles.navIcon}>👥</span>
            Resource mgmt
          </button>
          <button style={styles.navItem} onClick={() => navigate('/templates')}>
            <span style={styles.navIcon}>📋</span>
            Project template
          </button>
        </nav>
      </aside>

      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Resource Management</h1>
          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search resources..." style={styles.searchInput} />
            </div>
            <button style={styles.notificationBtn}>🔔</button>
            <div style={styles.userProfile} onClick={() => navigate('/profile')}>
              <div style={styles.avatar}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          <div style={styles.resourcesHeader}>
            <h2 style={styles.sectionTitle}>Team Resources ({filteredResources.length})</h2>
            <select 
              style={styles.filterDropdown}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div style={styles.resourcesGrid}>
            {filteredResources.map((resource) => (
              <div key={resource.id} style={styles.resourceCard}>
                <div style={styles.resourceHeader}>
                  <div style={styles.resourceAvatar}>
                    {resource.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(resource.status) }}>
                    {resource.status.replace('-', ' ')}
                  </span>
                </div>

                <h3 style={styles.resourceName}>{resource.name}</h3>
                <p style={styles.resourceRole}>{resource.role}</p>
                <p style={styles.resourceEmail}>✉️ {resource.email}</p>

                <div style={styles.resourceStats}>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{resource.assignedProjects}</span>
                    <span style={styles.statLabel}>Projects</span>
                  </div>
                  <div style={styles.divider} />
                  <div style={styles.statItem}>
                    <span style={{ ...styles.statValue, color: getAvailabilityColor(resource.availability) }}>
                      {resource.availability}%
                    </span>
                    <span style={styles.statLabel}>Available</span>
                  </div>
                </div>

                <div style={styles.availabilityBar}>
                  <div 
                    style={{
                      ...styles.availabilityFill,
                      width: `${resource.availability}%`,
                      backgroundColor: getAvailabilityColor(resource.availability)
                    }}
                  />
                </div>

                <button style={styles.viewProfileBtn}>View Profile</button>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div style={styles.statsSection}>
            <h3 style={styles.statsTitle}>Resource Statistics</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>👥</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dummyResources.length}</div>
                  <div style={styles.statText}>Total Resources</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>✓</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dummyResources.filter(r => r.status === 'available').length}</div>
                  <div style={styles.statText}>Available</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>⚡</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dummyResources.filter(r => r.status === 'busy').length}</div>
                  <div style={styles.statText}>Busy</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>🏖️</div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>{dummyResources.filter(r => r.status === 'on-leave').length}</div>
                  <div style={styles.statText}>On Leave</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: 'white',
    color: '#1a1a1a',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  plusIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ff6b35',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    backgroundColor: 'transparent',
    color: '#999',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navItemActive: {
    backgroundColor: 'white',
    color: '#1a1a1a',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navIcon: {
    fontSize: '18px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '8px 16px',
    gap: '8px',
    width: '300px',
  },
  searchIcon: {
    fontSize: '16px',
    color: '#6b7280',
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    flex: 1,
    fontSize: '14px',
  },
  notificationBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
  },
  userProfile: {
    cursor: 'pointer',
    padding: '8px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    padding: '32px 40px',
    flex: 1,
  },
  resourcesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
  },
  filterDropdown: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  resourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  resourceAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
  },
  resourceName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
  },
  resourceRole: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  resourceEmail: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 16px 0',
  },
  resourceStats: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '16px 0',
    marginBottom: '16px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  divider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#e5e7eb',
  },
  availabilityBar: {
    height: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  availabilityFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  viewProfileBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  statsSection: {
    marginTop: '32px',
  },
  statsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statText: {
    fontSize: '14px',
    color: '#6b7280',
  },
};

export default Resources;
