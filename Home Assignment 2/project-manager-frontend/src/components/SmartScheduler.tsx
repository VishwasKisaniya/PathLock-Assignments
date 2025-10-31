import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { schedulerAPI, projectsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { ScheduleTaskInput, ScheduledTask, Task } from '../types';

interface SmartSchedulerProps {
  projectId: number;
  onClose: () => void;
}

const SmartScheduler = ({ projectId, onClose }: SmartSchedulerProps) => {
  const { isDarkMode } = useTheme();
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Fetch existing project tasks on mount
  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const proj = await projectsAPI.getById(projectId);
        setProjectTasks(proj.tasks || []);
      } catch (err: any) {
        setError('Failed to load project tasks for scheduling');
      }
    };

    load();
  }, [projectId]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!projectTasks || projectTasks.length === 0) {
        setError('No tasks found in this project to schedule');
        setLoading(false);
        return;
      }

      // Build an id -> title map to convert stored dependency ids into titles
      const idToTitle = new Map<number, string>();
      projectTasks.forEach((t) => idToTitle.set(t.id, t.title));

      // Convert project tasks into ScheduleTaskInput list (dependencies as titles)
      const scheduleTasks: ScheduleTaskInput[] = projectTasks.map((t) => {
        let depTitles: string[] = [];
        try {
          const deps = JSON.parse(t.dependencies || '[]');
          if (Array.isArray(deps)) {
            depTitles = deps
              .map((depId: number) => idToTitle.get(depId))
              .filter((x): x is string => typeof x === 'string');
          }
        } catch {
          depTitles = [];
        }

        return {
          title: t.title,
          estimatedHours: t.estimatedHours || 0,
          dueDate: t.dueDate || undefined,
          dependencies: depTitles,
        };
      });

      // Validate: every task must have title and estimatedHours > 0
      const invalid = scheduleTasks.filter((s) => !s.title || s.estimatedHours <= 0);
      if (invalid.length > 0) {
        setError('Some tasks are missing estimated hours or title. Please edit tasks and try again.');
        setLoading(false);
        return;
      }

      const response = await schedulerAPI.scheduleTasks(projectId, { tasks: scheduleTasks });
      setScheduledTasks(response.recommendedOrder);
      setShowResults(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule tasks');
    } finally {
      setLoading(false);
    }
  };

  const resetScheduler = () => {
    setShowResults(false);
    setScheduledTasks([]);
    // keep project tasks as-is; user can re-run scheduler
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{
        ...styles.container,
        backgroundColor: isDarkMode ? '#1f2937' : 'white',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          ...styles.header,
          backgroundColor: isDarkMode ? '#1f2937' : 'white',
          borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb',
        }}>
          <h2 style={{
            ...styles.title,
            color: isDarkMode ? '#f9fafb' : '#1e293b',
          }}>🤖 Smart Scheduler</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {!showResults ? (
          <div style={styles.form}>
            <p style={{
              ...styles.description,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}>
              This scheduler will use the existing tasks in the project (with their estimated hours
              and dependencies). Click Generate Schedule to compute the recommended order.
            </p>

            <div style={{ padding: '0 24px 16px' }}>
              <div style={{ 
                marginBottom: 8,
                color: isDarkMode ? '#f9fafb' : '#1f2937',
              }}>
                <strong>Tasks found:</strong> {projectTasks.length}
              </div>
              <div style={{ marginBottom: 12 }}>
                {projectTasks.slice(0, 10).map((t) => (
                  <div key={t.id} style={{ 
                    fontSize: 13, 
                    color: isDarkMode ? '#9ca3af' : '#374151' 
                  }}>{t.title}</div>
                ))}
                {projectTasks.length > 10 && (
                  <div style={{ 
                    fontSize: 12, 
                    color: isDarkMode ? '#6b7280' : '#6b7280' 
                  }}>...and more</div>
                )}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button type="button" onClick={onClose} style={styles.cancelButton}>
                Cancel
              </button>
              <button type="button" onClick={() => handleSubmit()} disabled={loading} style={styles.submitButton}>
                {loading ? 'Scheduling...' : '🚀 Generate Schedule'}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.resultsContainer}>
            <div style={{
              ...styles.successBanner,
              backgroundColor: isDarkMode ? '#374151' : '#d1fae5',
            }}>
              <span style={styles.successIcon}>✅</span>
              <div>
                <h3 style={{
                  ...styles.successTitle,
                  color: isDarkMode ? '#f9fafb' : '#065f46',
                }}>Schedule Generated Successfully!</h3>
                <p style={{
                  ...styles.successSubtitle,
                  color: isDarkMode ? '#9ca3af' : '#047857',
                }}>
                  Recommended execution order for {scheduledTasks.length} tasks
                </p>
              </div>
            </div>

            <div style={styles.timeline}>
              {scheduledTasks.map((task, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineMarker}>
                    <div style={styles.orderBadge}>{task.order}</div>
                    {index < scheduledTasks.length - 1 && <div style={styles.timelineLine} />}
                  </div>

                  <div style={{
                    ...styles.scheduledTaskCard,
                    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                  }}>
                    <div style={styles.scheduledTaskHeader}>
                      <h4 style={{
                        ...styles.scheduledTaskTitle,
                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                      }}>{task.title}</h4>
                      <div style={styles.scheduledTaskMeta}>
                        <span style={{
                          ...styles.metaBadge,
                          backgroundColor: isDarkMode ? '#1f2937' : '#e0f2fe',
                          color: isDarkMode ? '#9ca3af' : '#0c4a6e',
                        }}>⏱️ {task.estimatedHours}h</span>
                        {task.dueDate && (
                          <span style={{
                            ...styles.metaBadge,
                            backgroundColor: isDarkMode ? '#1f2937' : '#e0f2fe',
                            color: isDarkMode ? '#9ca3af' : '#0c4a6e',
                          }}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {task.dependencies.length > 0 && (
                      <div style={styles.dependenciesInfo}>
                        <span style={{
                          ...styles.dependenciesLabel,
                          color: isDarkMode ? '#9ca3af' : '#64748b',
                        }}>Depends on:</span>
                        <div style={styles.dependencyTags}>
                          {task.dependencies.map((dep, depIndex) => (
                            <span key={depIndex} style={{
                              ...styles.dependencyTag,
                              backgroundColor: isDarkMode ? '#1f2937' : '#fef3c7',
                              color: isDarkMode ? '#9ca3af' : '#92400e',
                            }}>
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.resultsSummary}>
              <div style={styles.summaryCard}>
                <span style={styles.summaryIcon}>📊</span>
                <div>
                  <div style={styles.summaryValue}>{scheduledTasks.length}</div>
                  <div style={styles.summaryLabel}>Total Tasks</div>
                </div>
              </div>
              <div style={styles.summaryCard}>
                <span style={styles.summaryIcon}>⏰</span>
                <div>
                  <div style={styles.summaryValue}>
                    {scheduledTasks.reduce((acc, t) => acc + t.estimatedHours, 0)}h
                  </div>
                  <div style={styles.summaryLabel}>Total Hours</div>
                </div>
              </div>
              <div style={styles.summaryCard}>
                <span style={styles.summaryIcon}>🔗</span>
                <div>
                  <div style={styles.summaryValue}>
                    {scheduledTasks.filter((t) => t.dependencies.length > 0).length}
                  </div>
                  <div style={styles.summaryLabel}>With Dependencies</div>
                </div>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={resetScheduler} style={styles.resetButton}>
                ← Schedule Again
              </button>
              <button onClick={onClose} style={styles.doneButton}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px 8px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 32px',
    borderLeft: '4px solid #ef4444',
    margin: '16px 32px',
  },
  form: {
    padding: '24px 32px 32px',
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px',
  },
  taskCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    border: '2px solid #e5e7eb',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  taskNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ff6b35',
    margin: 0,
  },
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formGroupSmall: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  dependenciesSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  dependenciesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#4b5563',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
  },
  addTaskButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  resultsContainer: {
    padding: '32px',
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    border: '2px solid #a7f3d0',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  successIcon: {
    fontSize: '32px',
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#065f46',
    margin: '0 0 4px 0',
  },
  successSubtitle: {
    fontSize: '14px',
    color: '#047857',
    margin: 0,
  },
  timeline: {
    marginBottom: '32px',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
  },
  timelineMarker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4px',
  },
  orderBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ff6b35',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
  },
  timelineLine: {
    width: '2px',
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: '8px',
    minHeight: '40px',
  },
  scheduledTaskCard: {
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    flex: 1,
    marginBottom: '16px',
  },
  scheduledTaskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  scheduledTaskTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
  },
  scheduledTaskMeta: {
    display: 'flex',
    gap: '8px',
  },
  metaBadge: {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    color: '#6b7280',
  },
  dependenciesInfo: {
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  dependenciesLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '6px',
    display: 'block',
  },
  dependencyTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  dependencyTag: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '4px',
    border: '1px solid #fbbf24',
  },
  resultsSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #e5e7eb',
  },
  summaryIcon: {
    fontSize: '32px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  resetButton: {
    padding: '10px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  doneButton: {
    padding: '10px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default SmartScheduler;
