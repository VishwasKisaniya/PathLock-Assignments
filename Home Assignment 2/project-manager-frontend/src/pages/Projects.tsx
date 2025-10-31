import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Project, ProjectDetail } from '../types';
import Layout from '../components/Layout';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ [key: number]: ProjectDetail }>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProjects();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);

      // Fetch details for each project to get task information
      const details: { [key: number]: ProjectDetail } = {};
      await Promise.all(
        data.map(async (project) => {
          try {
            const detail = await projectsAPI.getById(project.id);
            details[project.id] = detail;
          } catch (err) {
            console.error(`Failed to fetch details for project ${project.id}`);
          }
        })
      );
      setProjectDetails(details);
    } catch (err) {
      console.error('Failed to load projects');
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={styles.projectsHeader}>
          <h2 style={{
            ...styles.sectionTitle,
            color: isDarkMode ? '#f9fafb' : '#1e293b',
          }}>All Projects ({projects.length})</h2>
        </div>

        <div style={{
          ...styles.projectsGrid,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        }}>
          {projects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              gridColumn: '1 / -1',
            }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>No projects yet</p>
              <p>Create your first project to get started!</p>
            </div>
          ) : (
            projects.map((project) => {
              const detail = projectDetails[project.id];
              const tasks = detail?.tasks || [];
              const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
              const isCompleted = tasks.length > 0 && completedTasksCount === tasks.length;
              const statusColor = isCompleted ? '#dcfce7' : tasks.length > 0 ? '#dbeafe' : '#f3f4f6';
              const statusTextColor = isCompleted ? '#166534' : tasks.length > 0 ? '#1e40af' : '#6b7280';
              const statusText = isCompleted ? 'Completed' : tasks.length > 0 ? 'In Progress' : 'Not Started';

              return (
                <div key={project.id} style={{
                  ...styles.projectCard,
                  backgroundColor: isDarkMode ? '#1f2937' : 'white',
                  boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  <div style={styles.projectHeader}>
                    <h3 style={{
                      ...styles.projectName,
                      color: isDarkMode ? '#f9fafb' : '#1e293b',
                    }}>{project.title}</h3>
                    <span style={{ ...styles.statusBadge, backgroundColor: statusColor, color: statusTextColor }}>
                      {statusText}
                    </span>
                  </div>
                <p style={{
                  ...styles.projectDescription,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>{project.description || 'No description provided'}</p>
                
                <div style={styles.projectMeta}>
                  <div style={styles.metaItem}>
                    <span style={{
                      ...styles.metaLabel,
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                    }}>Owner:</span>
                    <span style={{
                      ...styles.metaValue,
                      color: isDarkMode ? '#f9fafb' : '#1e293b',
                    }}>{user?.username || 'You'}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={{
                      ...styles.metaLabel,
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                    }}>Created:</span>
                    <span style={{
                      ...styles.metaValue,
                      color: isDarkMode ? '#f9fafb' : '#1e293b',
                    }}>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={styles.projectActions}>
                  <button
                    style={styles.viewButton}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  projectsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  projectName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
  projectDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px',
    lineHeight: '1.5',
    minHeight: '42px',
  },
  projectMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  metaLabel: {
    color: '#64748b',
    fontWeight: '500',
  },
  metaValue: {
    color: '#1e293b',
  },
  projectActions: {
    display: 'flex',
    gap: '8px',
  },
  viewButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Projects;
