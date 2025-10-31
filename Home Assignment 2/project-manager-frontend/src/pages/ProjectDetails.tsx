import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { ProjectDetail, Task } from '../types';
import SmartScheduler from '../components/SmartScheduler';
import Layout from '../components/Layout';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [taskEstimatedHours, setTaskEstimatedHours] = useState<number>(1);
  const [taskDependencies, setTaskDependencies] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;
    
    try {
      const data = await projectsAPI.getById(parseInt(id));
      setProject(data);
    } catch (err: any) {
      setError('Failed to load project');
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError('');
    setLoading(true);

    try {
      await tasksAPI.create(parseInt(id), {
        title: taskTitle,
        dueDate: taskDueDate || undefined,
        estimatedHours: taskEstimatedHours,
        dependencies: JSON.stringify(taskDependencies),
      });
      setSuccessMessage('Task created successfully!');
      setShowModal(false);
      resetForm();
      fetchProject();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setError('');
    setLoading(true);

    try {
      await tasksAPI.update(editingTask.id, {
        title: taskTitle,
        dueDate: taskDueDate || undefined,
        isCompleted: taskCompleted,
        estimatedHours: taskEstimatedHours,
        dependencies: JSON.stringify(taskDependencies),
      });
      setSuccessMessage('Task updated successfully!');
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchProject();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      setSuccessMessage('Task deleted successfully!');
      fetchProject();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksAPI.update(task.id, {
        title: task.title,
        dueDate: task.dueDate || undefined,
        isCompleted: !task.isCompleted,
        estimatedHours: task.estimatedHours,
        dependencies: task.dependencies,
      });
      fetchProject();
    } catch (err: any) {
      setError('Failed to update task status');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setTaskCompleted(task.isCompleted);
    setTaskEstimatedHours(task.estimatedHours);
    try {
      const deps = JSON.parse(task.dependencies);
      setTaskDependencies(Array.isArray(deps) ? deps : []);
    } catch {
      setTaskDependencies([]);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDueDate('');
    setTaskCompleted(false);
    setTaskEstimatedHours(1);
    setTaskDependencies([]);
    setEditingTask(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (!project) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={() => navigate('/projects')} style={{
          ...styles.backButton,
          backgroundColor: isDarkMode ? '#374151' : '#64748b',
        }}>
          ← Back to Projects
        </button>
        <div style={{
          ...styles.projectHeader,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        }}>
          <div>
            <h1 style={{
              ...styles.projectTitle,
              color: isDarkMode ? '#f9fafb' : '#1e293b',
            }}>{project.title}</h1>
            <p style={{
              ...styles.projectDescription,
              color: isDarkMode ? '#9ca3af' : '#64748b',
            }}>{project.description || 'No description'}</p>
          </div>
          <div style={styles.headerButtons}>
            <button onClick={() => setShowScheduler(true)} style={styles.schedulerButton}>
              🤖 Smart Scheduler
            </button>
            <button onClick={() => setShowModal(true)} style={styles.addTaskButton}>
              + Add Task
            </button>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {successMessage && <div style={styles.success}>{successMessage}</div>}

        <div style={{
          ...styles.tasksContainer,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
        }}>
          <h2 style={{
            ...styles.tasksTitle,
            color: isDarkMode ? '#f9fafb' : '#1e293b',
          }}>Tasks ({project.tasks.length})</h2>
          {project.tasks.length === 0 ? (
            <p style={{
              ...styles.emptyState,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}>No tasks yet. Add your first task!</p>
          ) : (
            <div style={styles.tasksList}>
              {project.tasks.map((task) => (
                <div key={task.id} style={{
                  ...styles.taskCard,
                  backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                }}>
                  <div style={styles.taskLeft}>
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleComplete(task)}
                      style={styles.checkbox}
                    />
                    <div>
                      <h3
                        style={{
                          ...styles.taskTitle,
                          color: isDarkMode ? '#f9fafb' : '#1e293b',
                          ...(task.isCompleted ? styles.taskTitleCompleted : {}),
                        }}
                      >
                        {task.title}
                      </h3>
                      {task.dueDate && (
                        <p style={{
                          ...styles.taskDueDate,
                          color: isDarkMode ? '#9ca3af' : '#64748b',
                        }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={styles.taskActions}>
                    <button onClick={() => openEditModal(task)} style={styles.editButton}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={{
            ...styles.modal,
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              ...styles.modalTitle,
              color: isDarkMode ? '#f9fafb' : '#1e293b',
            }}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Title *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  maxLength={200}
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                    color: isDarkMode ? '#f9fafb' : '#1f2937',
                  }}
                  placeholder="Enter task title"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                    color: isDarkMode ? '#f9fafb' : '#1f2937',
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Estimated Hours *</label>
                <input
                  type="number"
                  value={taskEstimatedHours}
                  onChange={(e) => setTaskEstimatedHours(parseFloat(e.target.value) || 1)}
                  onFocus={(e) => e.target.select()}
                  required
                  min="0.5"
                  step="0.5"
                  style={{
                    ...styles.input,
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                    color: isDarkMode ? '#f9fafb' : '#1f2937',
                  }}
                  placeholder="Enter estimated hours (minimum 0.5)"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  color: isDarkMode ? '#f9fafb' : '#374151',
                }}>Dependencies (Select tasks this depends on)</label>
                <div style={{
                  ...styles.dependenciesContainer,
                  backgroundColor: isDarkMode ? '#374151' : '#f9f9f9',
                  borderColor: isDarkMode ? '#4b5563' : '#ddd',
                }}>
                  {project?.tasks
                    .filter(t => !editingTask || t.id !== editingTask.id)
                    .map(task => (
                      <div key={task.id} style={styles.dependencyCheckbox}>
                        <input
                          type="checkbox"
                          id={`dep-${task.id}`}
                          checked={taskDependencies.includes(task.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTaskDependencies([...taskDependencies, task.id]);
                            } else {
                              setTaskDependencies(taskDependencies.filter(id => id !== task.id));
                            }
                          }}
                        />
                        <label htmlFor={`dep-${task.id}`} style={{
                          ...styles.dependencyLabel,
                          color: isDarkMode ? '#f9fafb' : '#374151',
                        }}>
                          {task.title}
                        </label>
                      </div>
                    ))}
                  {(!project?.tasks || project.tasks.length === 0 || (editingTask && project.tasks.length === 1)) && (
                    <p style={{
                      ...styles.noDependencies,
                      color: isDarkMode ? '#9ca3af' : '#9ca3af',
                    }}>No other tasks available</p>
                  )}
                </div>
              </div>
              {editingTask && (
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={taskCompleted}
                    onChange={(e) => setTaskCompleted(e.target.checked)}
                    id="completed"
                  />
                  <label htmlFor="completed" style={styles.checkboxLabel}>
                    Mark as completed
                  </label>
                </div>
              )}
              <div style={styles.modalActions}>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                  {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {showScheduler && id && (
          <SmartScheduler projectId={parseInt(id)} onClose={() => setShowScheduler(false)} />
        )}
      </div>
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#64748b',
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '14px',
  },
  success: {
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '14px',
  },
  projectHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  projectDescription: {
    fontSize: '16px',
    color: '#666',
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
  },
  schedulerButton: {
    padding: '12px 24px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  addTaskButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  tasksContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tasksContainer_OLD: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tasksTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
    padding: '40px',
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px',
  },
  taskTitleCompleted: {
    textDecoration: 'line-through',
    color: '#999',
  },
  taskDueDate: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
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
    color: '#555',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#555',
  },
  dependenciesContainer: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '12px',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
  },
  dependencyCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    marginBottom: '4px',
  },
  dependencyLabel: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  noDependencies: {
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ProjectDetails;
