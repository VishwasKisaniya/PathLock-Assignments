import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, projectsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { ProjectDetail } from '../types';
import Layout from '../components/Layout';

interface ProfileData {
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({ projects: 0, completedTasks: 0, hoursLogged: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    profileImageUrl: '',
    createdAt: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileAPI.get();
      setProfileData(data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const fetchStats = async () => {
    try {
      const projects = await projectsAPI.getAll();
      let totalCompletedTasks = 0;
      let totalHours = 0;

      // Fetch details for each project to count tasks and hours
      await Promise.all(
        projects.map(async (project) => {
          try {
            const detail: ProjectDetail = await projectsAPI.getById(project.id);
            if (detail.tasks) {
              totalCompletedTasks += detail.tasks.filter((t) => t.isCompleted).length;
              totalHours += detail.tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
            }
          } catch (err) {
            console.error(`Failed to fetch project ${project.id}`);
          }
        })
      );

      // Calculate hours based on account creation date
      const profile = await profileAPI.get();
      const accountCreatedDate = new Date(profile.createdAt);
      const now = new Date();
      const hoursSinceCreation = Math.floor((now.getTime() - accountCreatedDate.getTime()) / (1000 * 60 * 60));

      setStats({
        projects: projects.length,
        completedTasks: totalCompletedTasks,
        hoursLogged: hoursSinceCreation,
      });
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profileImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await profileAPI.update({
        fullName: profileData.fullName,
        bio: profileData.bio,
        profileImageUrl: profileData.profileImageUrl,
      });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>

        <div>
          {error && <div style={styles.errorMessage}>{error}</div>}
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

          <div style={{
            ...styles.profileCard,
            backgroundColor: isDarkMode ? '#1f2937' : 'white',
          }}>
            {!isEditing ? (
              // View Mode
              <>
                <div style={styles.profileHeader}>
                  <div style={styles.profileLeft}>
                    {profileData.profileImageUrl ? (
                      <img src={profileData.profileImageUrl} alt="Profile" style={styles.profileImage} />
                    ) : (
                      <div style={styles.profilePlaceholder}>
                        {profileData.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div style={styles.profileInfo}>
                      <h2 style={{
                        ...styles.profileName,
                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                      }}>{profileData.fullName || profileData.username}</h2>
                      <p style={{
                        ...styles.profileEmail,
                        color: isDarkMode ? '#9ca3af' : '#64748b',
                      }}>✉️ {profileData.email}</p>
                      <p style={{
                        ...styles.profileUsername,
                        color: isDarkMode ? '#9ca3af' : '#64748b',
                      }}>@{profileData.username}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                    ✏️ Edit Profile
                  </button>
                </div>

                <div style={styles.profileSection}>
                  <h3 style={{
                    ...styles.sectionTitle,
                    color: isDarkMode ? '#f9fafb' : '#1e293b',
                  }}>About</h3>
                  <p style={{
                    ...styles.bioText,
                    color: isDarkMode ? '#9ca3af' : '#64748b',
                  }}>{profileData.bio || 'No bio added yet.'}</p>
                </div>

                <div style={{
                  ...styles.statsGrid,
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                }}>
                  <div style={{
                    ...styles.statCard,
                    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  }}>
                    <div style={styles.statIcon}>📁</div>
                    <div style={styles.statContent}>
                      <div style={{
                        ...styles.statValue,
                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                      }}>{stats.projects}</div>
                      <div style={{
                        ...styles.statLabel,
                        color: isDarkMode ? '#9ca3af' : '#64748b',
                      }}>Projects</div>
                    </div>
                  </div>
                  <div style={{
                    ...styles.statCard,
                    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  }}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>✓</div>
                    <div style={styles.statContent}>
                      <div style={{
                        ...styles.statValue,
                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                      }}>{stats.completedTasks}</div>
                      <div style={{
                        ...styles.statLabel,
                        color: isDarkMode ? '#9ca3af' : '#64748b',
                      }}>Completed Tasks</div>
                    </div>
                  </div>
                  <div style={{
                    ...styles.statCard,
                    backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                  }}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}>⏱️</div>
                    <div style={styles.statContent}>
                      <div style={{
                        ...styles.statValue,
                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                      }}>{stats.hoursLogged}h</div>
                      <div style={{
                        ...styles.statLabel,
                        color: isDarkMode ? '#9ca3af' : '#64748b',
                      }}>Hours Logged</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <div style={{
                  ...styles.editHeader,
                  borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb',
                }}>
                  <h2 style={{
                    ...styles.editTitle,
                    color: isDarkMode ? '#f9fafb' : '#1a1a1a',
                  }}>Edit Profile</h2>
                  <button type="button" onClick={() => setIsEditing(false)} style={{
                    ...styles.cancelButton,
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    color: isDarkMode ? '#f9fafb' : '#374151',
                  }}>
                    Cancel
                  </button>
                </div>

                <div style={{
                  ...styles.imageSection,
                  backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                }}>
                  <div style={styles.imagePreview}>
                    {profileData.profileImageUrl ? (
                      <img src={profileData.profileImageUrl} alt="Profile" style={styles.previewImage} />
                    ) : (
                      <div style={styles.previewPlaceholder}>
                        {profileData.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div style={styles.imageUpload}>
                    <label style={{
                      ...styles.uploadLabel,
                      color: isDarkMode ? '#f9fafb' : '#374151',
                    }}>Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        ...styles.fileInput,
                        backgroundColor: isDarkMode ? '#1f2937' : 'white',
                        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                        color: isDarkMode ? '#f9fafb' : '#1f2937',
                      }}
                    />
                    <input
                      type="text"
                      name="profileImageUrl"
                      value={profileData.profileImageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste image URL"
                      style={{
                        ...styles.input,
                        backgroundColor: isDarkMode ? '#1f2937' : 'white',
                        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                        color: isDarkMode ? '#f9fafb' : '#1f2937',
                      }}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={{
                    ...styles.label,
                    color: isDarkMode ? '#f9fafb' : '#374151',
                  }}>Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    disabled
                    style={{
                      ...styles.inputDisabled,
                      backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#9ca3af' : '#9ca3af',
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={{
                    ...styles.label,
                    color: isDarkMode ? '#f9fafb' : '#374151',
                  }}>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{
                      ...styles.inputDisabled,
                      backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#9ca3af' : '#9ca3af',
                    }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={{
                    ...styles.label,
                    color: isDarkMode ? '#f9fafb' : '#374151',
                  }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      backgroundColor: isDarkMode ? '#1f2937' : 'white',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#f9fafb' : '#1f2937',
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={{
                    ...styles.label,
                    color: isDarkMode ? '#f9fafb' : '#374151',
                  }}>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    style={{
                      ...styles.textarea,
                      backgroundColor: isDarkMode ? '#1f2937' : 'white',
                      borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#f9fafb' : '#1f2937',
                    }}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <div style={{
                    ...styles.charCount,
                    color: isDarkMode ? '#9ca3af' : '#9ca3af',
                  }}>{(profileData.bio || '').length} / 500 characters</div>
                </div>

                <div style={{
                  ...styles.formActions,
                  borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
                }}>
                  <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
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
    width: 'fit-content',
    transition: 'background-color 0.2s',
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
  avatarImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  content: {
    padding: '32px 40px',
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #e5e7eb',
  },
  profileLeft: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '4px solid #fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  profilePlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
    border: '4px solid #fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  profileName: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },
  profileEmail: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  profileUsername: {
    fontSize: '14px',
    color: '#ff6b35',
    fontWeight: '500',
    margin: 0,
  },
  editButton: {
    padding: '10px 24px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profileSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '12px',
  },
  bioText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
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
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  editTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  imageSection: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '24px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
  },
  imagePreview: {
    flexShrink: 0,
  },
  previewImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid #fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  previewPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    border: '3px solid #fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  imageUpload: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  uploadLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  fileInput: {
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  inputDisabled: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    boxSizing: 'border-box',
  },
  charCount: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
    textAlign: 'right',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  submitButton: {
    padding: '12px 32px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fecaca',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #a7f3d0',
  },
};

export default Profile;
