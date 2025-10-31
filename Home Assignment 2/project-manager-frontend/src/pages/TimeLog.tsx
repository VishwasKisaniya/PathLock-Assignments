import { useNavigate } from 'react-router-dom';
import { dummyTimeLogs } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const TimeLog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalHours = dummyTimeLogs.reduce((sum, log) => sum + log.hours, 0);
  const todayLogs = dummyTimeLogs.filter(log => log.date === '2024-10-30');
  const todayHours = todayLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📊</div>
          <span style={styles.logoText}>Promage</span>
        </div>

        <button style={styles.createButton}>
          <span style={styles.plusIcon}>+</span>
          Log time entry
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
          <button style={styles.navItemActive} onClick={() => navigate('/time-log')}>
            <span style={styles.navIcon}>⏰</span>
            Time log
          </button>
          <button style={styles.navItem} onClick={() => navigate('/resources')}>
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
          <h1 style={styles.pageTitle}>Time Log</h1>
          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search time logs..." style={styles.searchInput} />
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
          {/* Statistics Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{todayHours}h</div>
                <div style={styles.statLabel}>Today's Hours</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>📅</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{totalHours}h</div>
                <div style={styles.statLabel}>Total Hours</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>📊</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{(totalHours / dummyTimeLogs.length).toFixed(1)}h</div>
                <div style={styles.statLabel}>Average per Day</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>📝</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{dummyTimeLogs.length}</div>
                <div style={styles.statLabel}>Total Entries</div>
              </div>
            </div>
          </div>

          {/* Time Logs Table */}
          <div style={styles.tableSection}>
            <h2 style={styles.sectionTitle}>Time Entries</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Project</th>
                    <th style={styles.th}>Task</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyTimeLogs.map((log) => (
                    <tr key={log.id} style={styles.tableRow}>
                      <td style={styles.td}>
                        <span style={styles.dateCell}>
                          📅 {new Date(log.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.projectCell}>{log.projectName}</span>
                      </td>
                      <td style={styles.td}>{log.taskName}</td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.miniAvatar}>
                            {log.user.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          {log.user}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.hoursCell}>{log.hours}h</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px',
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
    background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  tableSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '2px solid #e5e7eb',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151',
  },
  dateCell: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '13px',
  },
  projectCell: {
    fontWeight: '500',
    color: '#1a1a1a',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  miniAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  hoursCell: {
    fontWeight: '600',
    color: '#ff6b35',
    fontSize: '15px',
  },
};

export default TimeLog;
