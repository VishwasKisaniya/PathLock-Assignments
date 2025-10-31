import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Project, ProjectDetail } from '../types';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ [key: number]: ProjectDetail }>({});
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check URL parameter to open modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('create') === 'true') {
      setShowModal(true);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    // Refresh data every 30 seconds for real-time updates
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
    } catch (err: any) {
      setError('Failed to load projects');
    }
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await projectsAPI.create({ title, description: description || undefined });
      setSuccessMessage('Project created successfully!');
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      setSuccessMessage('Project deleted successfully!');
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError('Failed to delete project');
    }
  };

  // Calculate real-time statistics
  const calculateProjectStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    let projectsWithAllTasksComplete = 0;
    let projectsInProgress = 0;
    Object.entries(projectDetails).forEach(([, detail]) => {
      if (detail.tasks && detail.tasks.length > 0) {
        totalTasks += detail.tasks.length;
        const completed = detail.tasks.filter((task) => task.isCompleted).length;
        completedTasks += completed;
        
        if (completed === detail.tasks.length) {
          projectsWithAllTasksComplete++;
        } else if (completed > 0) {
          projectsInProgress++;
        }
      }
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects: projects.length,
      completedProjects: projectsWithAllTasksComplete,
      ongoingProjects: projectsInProgress,
      delayedProjects: 0, // Can be calculated based on dueDate if needed
      averageProgress: overallProgress,
    };
  };

  const stats = calculateProjectStats();
  const { totalProjects, completedProjects, ongoingProjects, delayedProjects, averageProgress } = stats;

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={() => setShowModal(true)} style={styles.createButton}>
          <span style={styles.plusIcon}>+</span>
          Create new project
        </button>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

        {/* Overview Section */}
        <div style={{
          ...styles.section,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        }}>
          <div style={styles.sectionHeader}>
            <h2 style={{
              ...styles.sectionTitle,
              color: isDarkMode ? '#f9fafb' : '#1e293b',
            }}>Overview</h2>
            <select style={{
              ...styles.dropdown,
              backgroundColor: isDarkMode ? '#374151' : 'white',
              color: isDarkMode ? '#f9fafb' : '#1e293b',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            }}>
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div style={{
            ...styles.statsGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          }}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' }}>
                📁
              </div>
              <div style={styles.statContent}>
                <div style={{
                  ...styles.statLabel,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>Projects</div>
                <div style={{
                  ...styles.statValue,
                  color: isDarkMode ? '#f9fafb' : '#1e293b',
                }}>{totalProjects}</div>
                <div style={{
                  ...styles.statChange,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>Total active projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div style={styles.mainGrid}>
          <div style={{
            ...styles.projectSection,
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
          }}>
            <div style={styles.projectHeader}>
              <h2 style={{
                ...styles.sectionTitle,
                color: isDarkMode ? '#f9fafb' : '#1e293b',
              }}>Project summary</h2>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={{
                    ...styles.tableHeader,
                    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  }}>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Name</th>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Project manager</th>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Due date</th>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Status</th>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Progress</th>
                    <th style={{
                      ...styles.th,
                      color: isDarkMode ? '#f9fafb' : '#64748b',
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{
                        ...styles.td,
                        textAlign: 'center',
                        padding: '40px',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        backgroundColor: isDarkMode ? '#1f2937' : 'transparent',
                      }}>
                        No projects yet. Click "Create new project" to get started!
                      </td>
                    </tr>
                  ) : (
                    projects.slice(0, 5).map((project) => {
                      const detail = projectDetails[project.id];
                      const tasks = detail?.tasks || [];
                      const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
                      const progress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
                      const isCompleted = tasks.length > 0 && completedTasksCount === tasks.length;
                      const statusColor = isCompleted ? '#dcfce7' : '#dbeafe';
                      const statusTextColor = isCompleted ? '#166534' : '#1e40af';
                      const statusText = isCompleted ? 'Completed' : tasks.length > 0 ? 'In Progress' : 'Not Started';

                      return (
                        <tr key={project.id} style={{
                          ...styles.tableRow,
                          backgroundColor: isDarkMode ? '#1f2937' : 'white',
                          borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}>
                          <td style={{
                            ...styles.td,
                            color: isDarkMode ? '#f9fafb' : '#1e293b',
                          }}>{project.title}</td>
                          <td style={{
                            ...styles.td,
                            color: isDarkMode ? '#9ca3af' : '#64748b',
                          }}>{user?.username || 'You'}</td>
                          <td style={{
                            ...styles.td,
                            color: isDarkMode ? '#9ca3af' : '#64748b',
                          }}>{new Date(project.createdAt).toLocaleDateString()}</td>
                          <td style={{
                            ...styles.td,
                          }}>
                            <span style={{ ...styles.statusCompleted, backgroundColor: statusColor, color: statusTextColor }}>
                              {statusText}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ ...styles.progressCircle, borderColor: '#10b981', color: '#10b981' }}>
                              {progress}%
                            </div>
                          </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => navigate(`/projects/${project.id}`)}
                              style={styles.viewButton}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Card */}
          <div style={{
            ...styles.progressCard,
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
          }}>
            <div style={styles.progressHeader}>
              <h3 style={{
                ...styles.progressTitle,
                color: isDarkMode ? '#f9fafb' : '#1e293b',
              }}>Overall Progress</h3>
              <select style={{
                ...styles.smallDropdown,
                backgroundColor: isDarkMode ? '#374151' : 'white',
                color: isDarkMode ? '#f9fafb' : '#1e293b',
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              }}>
                <option>All</option>
              </select>
            </div>

            <div style={styles.progressCircleContainer}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="20"
                  strokeDasharray={`${(averageProgress / 100) * 502.4} 502.4`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <text x="100" y="95" textAnchor="middle" fontSize="36" fontWeight="bold" fill={isDarkMode ? '#f9fafb' : '#333'}>
                  {averageProgress}%
                </text>
                <text x="100" y="115" textAnchor="middle" fontSize="14" fill={isDarkMode ? '#9ca3af' : '#999'}>
                  Completed
                </text>
              </svg>
            </div>

            <div style={styles.progressStats}>
              <div style={styles.progressStat}>
                <div style={{
                  ...styles.progressStatValue,
                  color: isDarkMode ? '#f9fafb' : '#1e293b',
                }}>{totalProjects}</div>
                <div style={{
                  ...styles.progressStatLabel,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>Total projects</div>
              </div>
              <div style={styles.progressStat}>
                <div style={{ ...styles.progressStatValue, color: '#10b981' }}>{completedProjects}</div>
                <div style={{
                  ...styles.progressStatLabel,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>Completed</div>
              </div>
              <div style={styles.progressStat}>
                <div style={{ ...styles.progressStatValue, color: '#fbbf24' }}>{delayedProjects}</div>
                <div style={{
                  ...styles.progressStatLabel,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>Delayed</div>
              </div>
              <div style={styles.progressStat}>
                <div style={{ ...styles.progressStatValue, color: '#ef4444' }}>{ongoingProjects}</div>
                <div style={{
                  ...styles.progressStatLabel,
                  color: isDarkMode ? '#9ca3af' : '#64748b',
                }}>On going</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div style={{
          ...styles.tasksSection,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        }}>
          <h2 style={{
            ...styles.sectionTitle,
            color: isDarkMode ? '#f9fafb' : '#1e293b',
          }}>Recent Projects</h2>
          <p style={{
            fontSize: '14px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            marginBottom: '20px',
          }}>
            {projects.length === 0 ? 'No projects yet' : `${projects.length} total projects`}
          </p>

          <div style={styles.taskList}>
            {projects.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
              }}>
                <p>Create your first project to get started!</p>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <div key={project.id} style={{
                  ...styles.taskItem,
                  backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                }}>
                  <span style={{
                    ...styles.taskBullet,
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                  }}>●</span>
                  <span style={{
                    ...styles.taskText,
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                  }}>{project.title}</span>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    style={{ ...styles.taskStatusApproved, backgroundColor: '#dbeafe', color: '#1e40af', cursor: 'pointer' }}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={{
            ...styles.modal,
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              ...styles.modalTitle,
              color: isDarkMode ? '#f9fafb' : '#1e293b',
            }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Project Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  }}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    ...styles.textarea,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  }}
                  placeholder="Enter project description (optional)"
                  rows={4}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  createButton: {
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  plusIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  errorMessage: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '14px',
  },
  successMessage: {
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  dropdown: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statChange: {
    fontSize: '12px',
    color: '#64748b',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  projectSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterDropdown: {
    padding: '6px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  tableHeader: {
    borderBottom: '2px solid #e5e7eb',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#1e293b',
  },
  statusCompleted: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
  progressCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
  },
  viewButton: {
    padding: '6px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteButton: {
    padding: '6px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  progressTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  smallDropdown: {
    padding: '4px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  progressCircleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  progressStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  progressStat: {
    textAlign: 'center',
  },
  progressStatValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '4px',
  },
  progressStatLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  tasksSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
  },
  taskBullet: {
    color: '#3b82f6',
    fontSize: '18px',
  },
  taskText: {
    flex: 1,
    fontSize: '14px',
    color: '#1e293b',
  },
  taskStatusApproved: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default Dashboard;
