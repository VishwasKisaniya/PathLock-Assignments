import { useNavigate } from 'react-router-dom';
import { dummyTemplates } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'mobile development':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'marketing':
        return { backgroundColor: '#fce7f3', color: '#9f1239' };
      case 'product':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'design':
        return { backgroundColor: '#e0e7ff', color: '#3730a3' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
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
          Create new template
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
          <button style={styles.navItem} onClick={() => navigate('/resources')}>
            <span style={styles.navIcon}>👥</span>
            Resource mgmt
          </button>
          <button style={styles.navItemActive} onClick={() => navigate('/templates')}>
            <span style={styles.navIcon}>📋</span>
            Project template
          </button>
        </nav>
      </aside>

      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Project Templates</h1>
          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search templates..." style={styles.searchInput} />
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
          <div style={styles.templatesHeader}>
            <h2 style={styles.sectionTitle}>Available Templates ({dummyTemplates.length})</h2>
            <p style={styles.subtitle}>Quick-start templates to accelerate your project setup</p>
          </div>

          <div style={styles.templatesGrid}>
            {dummyTemplates.map((template) => (
              <div key={template.id} style={styles.templateCard}>
                <div style={styles.templateIcon}>📋</div>
                
                <div style={styles.templateHeader}>
                  <h3 style={styles.templateName}>{template.name}</h3>
                  <span style={{ ...styles.categoryBadge, ...getCategoryColor(template.category) }}>
                    {template.category}
                  </span>
                </div>

                <p style={styles.templateDescription}>{template.description}</p>

                <div style={styles.templateMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>✓</span>
                    <span style={styles.metaText}>{template.tasksCount} tasks</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>⏱️</span>
                    <span style={styles.metaText}>{template.estimatedDuration}</span>
                  </div>
                </div>

                <div style={styles.templateActions}>
                  <button style={styles.previewBtn}>Preview</button>
                  <button style={styles.useTemplateBtn}>Use Template</button>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div style={styles.statsSection}>
            <h3 style={styles.statsTitle}>Template Categories</h3>
            <div style={styles.categoriesGrid}>
              <div style={styles.categoryCard}>
                <div style={{ ...styles.categoryIcon, background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>
                  💻
                </div>
                <div style={styles.categoryContent}>
                  <div style={styles.categoryName}>Web Development</div>
                  <div style={styles.categoryCount}>
                    {dummyTemplates.filter(t => t.category === 'Web Development').length} templates
                  </div>
                </div>
              </div>

              <div style={styles.categoryCard}>
                <div style={{ ...styles.categoryIcon, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>
                  📱
                </div>
                <div style={styles.categoryContent}>
                  <div style={styles.categoryName}>Mobile Development</div>
                  <div style={styles.categoryCount}>
                    {dummyTemplates.filter(t => t.category === 'Mobile Development').length} templates
                  </div>
                </div>
              </div>

              <div style={styles.categoryCard}>
                <div style={{ ...styles.categoryIcon, background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' }}>
                  📢
                </div>
                <div style={styles.categoryContent}>
                  <div style={styles.categoryName}>Marketing</div>
                  <div style={styles.categoryCount}>
                    {dummyTemplates.filter(t => t.category === 'Marketing').length} templates
                  </div>
                </div>
              </div>

              <div style={styles.categoryCard}>
                <div style={{ ...styles.categoryIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  🎨
                </div>
                <div style={styles.categoryContent}>
                  <div style={styles.categoryName}>Design</div>
                  <div style={styles.categoryCount}>
                    {dummyTemplates.filter(t => t.category === 'Design').length} templates
                  </div>
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
  templatesHeader: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  templateIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '16px',
  },
  templateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px',
  },
  templateName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
    flex: 1,
  },
  categoryBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    whiteSpace: 'nowrap' as const,
  },
  templateDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  templateMeta: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f3f4f6',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaIcon: {
    fontSize: '14px',
  },
  metaText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  templateActions: {
    display: 'flex',
    gap: '12px',
  },
  previewBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'white',
    color: '#1a1a1a',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  useTemplateBtn: {
    flex: 1,
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
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  categoryIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  categoryContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryCount: {
    fontSize: '13px',
    color: '#6b7280',
  },
};

export default Templates;
