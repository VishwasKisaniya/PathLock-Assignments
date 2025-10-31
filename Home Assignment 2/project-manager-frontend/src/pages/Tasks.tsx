import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyTasks } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = dummyTasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'in-review':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'pending':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'completed':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '2px solid #f87171' };
      case 'medium':
        return { backgroundColor: '#fef3c7', color: '#92400e', border: '2px solid #fbbf24' };
      case 'low':
        return { backgroundColor: '#dbeafe', color: '#1e40af', border: '2px solid #60a5fa' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', border: '2px solid #d1d5db' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📊</div>
          <span style={styles.logoText}>Promage</span>
        </div>

        <button style={styles.createButton}>
          <span style={styles.plusIcon}>+</span>
          Create new task
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
          <button style={styles.navItemActive} onClick={() => navigate('/tasks')}>
            <span style={styles.navIcon}>✓</span>
            Tasks
          </button>
          <button style={styles.navItem} onClick={() => navigate('/time-log')}>
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

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Tasks</h1>
          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search tasks..." style={styles.searchInput} />
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
          <div style={styles.tasksHeader}>
            <h2 style={styles.sectionTitle}>All Tasks ({filteredTasks.length})</h2>
            <div style={styles.filters}>
              <select 
                style={styles.filterDropdown}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="in-review">In Review</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select 
                style={styles.filterDropdown}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div style={styles.tasksList}>
            {filteredTasks.map((task) => (
              <div key={task.id} style={styles.taskCard}>
                <div style={styles.taskLeft}>
                  <input type="checkbox" style={styles.checkbox} />
                  <div style={styles.taskBullet}>●</div>
                  <div style={styles.taskContent}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <div style={styles.taskMeta}>
                      <span style={styles.metaText}>📌 Assigned to: {task.assignedTo}</span>
                      <span style={styles.metaText}>📅 Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.taskRight}>
                  <span style={{ ...styles.priorityBadge, ...getPriorityStyle(task.priority) }}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(task.status) }}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Cards */}
          <div style={styles.statsSection}>
            <h3 style={styles.statsTitle}>Task Statistics</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dummyTasks.filter(t => t.status === 'completed').length}</div>
                  <div style={styles.statLabel}>Completed</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>⏳</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dummyTasks.filter(t => t.status === 'in-review').length}</div>
                  <div style={styles.statLabel}>In Review</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>⚠️</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dummyTasks.filter(t => t.priority === 'high').length}</div>
                  <div style={styles.statLabel}>High Priority</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>📋</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dummyTasks.length}</div>
                  <div style={styles.statLabel}>Total Tasks</div>
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
  tasksHeader: {
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
  filters: {
    display: 'flex',
    gap: '12px',
  },
  filterDropdown: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  taskBullet: {
    color: '#ff6b35',
    fontSize: '20px',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1a1a1a',
    margin: 0,
    marginBottom: '8px',
  },
  taskMeta: {
    display: 'flex',
    gap: '16px',
  },
  metaText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  taskRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  priorityBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
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
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
};

export default Tasks;
