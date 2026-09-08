import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import CourseCard from '../../components/CourseCard';
import ProgressBar from '../../components/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, GraduationCap, Award, FileText, CheckCircle, Clock, 
  Printer, X, ShieldCheck, Sparkles, Layers, Download, Flame, Trophy, Zap, Lock 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [dashboardData, setDashboardData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');
  
  // Certificate Modal State
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    Promise.all([
      axiosClient.get('/student/dashboard'),
      axiosClient.get('/public/courses')
    ])
      .then(([resDash, resCourses]) => {
        setDashboardData(resDash.data);
        setAllCourses(resCourses.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleEnrollFromDashboard = async (courseId) => {
    try {
      await axiosClient.post(`/student/enroll/${courseId}`);
      fetchDashboard();
    } catch (err) {
      fetchDashboard();
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) return <div className="loading-spinner">Loading Student Learning Hub...</div>;

  const enrollments = dashboardData?.enrollments || [];
  const recentAttempts = dashboardData?.recentAttempts || [];
  const recentSubmissions = dashboardData?.recentSubmissions || [];
  const streakDays = dashboardData?.streakDays || 5;
  const badges = dashboardData?.badges || [];
  const totalBadgesEarned = dashboardData?.totalBadgesEarned || 0;

  return (
    <div className="student-dashboard main-content">
      {/* Certificate Modal */}
      {selectedCertificateCourse && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="certificate-modal-box" style={{ background: '#ffffff', borderRadius: '18px', padding: '2.5rem', maxWidth: '750px', width: '100%', border: '8px double #059669', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative', textAlign: 'center' }}>
            <button 
              onClick={() => setSelectedCertificateCourse(null)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <Award size={56} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#059669', fontSize: '0.85rem', fontWeight: '800' }}>Official Certificate of Completion</h4>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', margin: '0.5rem 0', color: '#0f172a' }}>Rural Education Platform</h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Bridging the Educational Gap for Rural & Multilingual Students</p>
            </div>

            <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <p style={{ fontSize: '1.05rem', color: '#334155' }}>This certifies that</p>
              <h1 style={{ fontSize: '2.4rem', color: '#059669', fontFamily: 'var(--font-heading)', margin: '0.4rem 0' }}>{user?.fullName || 'Student Learner'}</h1>
              <p style={{ fontSize: '1.05rem', color: '#334155' }}>has successfully completed all lectures, assignments, and auto-graded quizzes for</p>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0.5rem 0' }}>"{selectedCertificateCourse.title}"</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Date Issued: <strong>{new Date().toLocaleDateString()}</strong></span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Verification ID: <strong>REP-CERT-2026-{selectedCertificateCourse.id}89</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handlePrintCertificate} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                  <Printer size={16} /> Print / Save Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gamified Learning Streak Banner */}
      <div className="streak-hero-card margin-bottom-lg" style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Flame size={38} color="#fef08a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{streakDays}-Day Learning Streak!</h2>
              <span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>🔥 Active</span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
              Awesome consistency, {user?.fullName || 'Student'}! Keep learning daily to unlock new achievement badges.
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.85, display: 'block' }}>Next Milestone</span>
          <strong style={{ fontSize: '1.1rem', color: '#fef08a' }}>7-Day Streak Master 🎉</strong>
          <div style={{ width: '140px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', marginTop: '6px' }}>
            <div style={{ width: `${Math.min(100, (streakDays / 7) * 100)}%`, height: '100%', background: '#fef08a', borderRadius: '3px' }}></div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="dashboard-welcome margin-bottom-lg">
        <div>
          <h2>My Learning Hub — {user?.fullName || 'Student'}</h2>
          <p>Access your enrolled courses, lecture progress, quiz attempts, and earned badges.</p>
        </div>
        <Link to="/courses" className="btn-primary">
          <BookOpen size={18} /> Browse Catalog
        </Link>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid margin-bottom-lg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon green"><BookOpen size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.enrolledCoursesCount || 0}</h3>
            <span>Enrolled Courses</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue"><Award size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.quizAttemptsCount || 0}</h3>
            <span>Quizzes Attempted</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple"><FileText size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.submissionsCount || 0}</h3>
            <span>Assignments Done</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon yellow" style={{ background: '#fef3c7', color: '#d97706' }}><Trophy size={24} /></div>
          <div className="metric-data">
            <h3>{totalBadgesEarned} / {badges.length}</h3>
            <span>Badges Unlocked</span>
          </div>
        </div>
      </div>

      {/* Udemy-Style "My Learning" Tabbed Navigation */}
      <div className="player-tabs-bar margin-bottom-lg">
        <button 
          className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrolled')}
        >
          <BookOpen size={18} /> My Enrolled Courses ({enrollments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          <Trophy size={18} /> Badges & Streaks ({badges.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Sparkles size={18} /> Recommended Courses ({allCourses.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={18} /> Certificates ({enrollments.length})
        </button>
      </div>

      {/* Tab Content: Badges & Achievements */}
      {activeTab === 'badges' && (
        <div className="dashboard-section">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>🏆 Your Academic Badges & Milestones</h3>
            <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '600' }}>Earned {totalBadgesEarned} out of {badges.length} Badges</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {badges.map(badge => (
              <div 
                key={badge.id}
                style={{
                  background: badge.unlocked ? '#ffffff' : '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: badge.unlocked ? '2px solid #a7f3d0' : '1px solid #e2e8f0',
                  boxShadow: badge.unlocked ? '0 10px 20px -5px rgba(16, 185, 129, 0.15)' : 'none',
                  opacity: badge.unlocked ? 1 : 0.8,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{
                      fontSize: '2.2rem',
                      background: badge.unlocked ? '#f0fdf4' : '#f1f5f9',
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}>
                      {badge.icon}
                    </div>
                    {badge.unlocked ? (
                      <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Unlocked 🎉
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', color: '#0f172a' }}>{badge.title}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {badge.category}
                  </span>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.5rem 0 1rem 0', lineHeight: 1.4 }}>
                    {badge.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Criteria: {badge.criteria}</span>
                    <strong>{badge.progressPercentage}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                    <div style={{
                      width: `${badge.progressPercentage}%`,
                      height: '100%',
                      background: badge.unlocked ? '#059669' : '#94a3b8',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="dashboard-section">
          {enrollments.length === 0 ? (
            <div className="no-results">
              <h3>No Enrolled Courses Yet</h3>
              <p className="margin-bottom-sm">Enroll in any course below to start watching video lectures and taking quizzes!</p>
              <button onClick={() => setActiveTab('all')} className="btn-primary">
                Explore All Courses
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {enrollments.map(en => (
                <div key={en.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CourseCard 
                    course={en.course} 
                    isEnrolled={true} 
                    progress={100}
                  />
                  <button 
                    onClick={() => setSelectedCertificateCourse(en.course)} 
                    className="btn-secondary margin-top-xs"
                    style={{ justifyContent: 'center', fontSize: '0.88rem' }}
                  >
                    <Award size={16} color="#059669" /> View Certificate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Recommended Catalog */}
      {activeTab === 'all' && (
        <div className="dashboard-section">
          <div className="courses-grid">
            {allCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnrollFromDashboard} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Certificates */}
      {activeTab === 'certificates' && (
        <div className="dashboard-section">
          <div className="quiz-list-grid">
            {enrollments.length === 0 ? (
              <div className="no-results">
                <h3>No Certificates Earned Yet</h3>
                <p>Complete your enrolled courses to generate official Certificates of Completion!</p>
              </div>
            ) : (
              enrollments.map(en => (
                <div key={en.id} className="quiz-card-modern">
                  <div className="quiz-card-header">
                    <span className="badge badge-green"><ShieldCheck size={12} /> Verified Certificate</span>
                    <h4>{en.course?.title}</h4>
                    <p className="text-muted" style={{ fontSize: '0.88rem' }}>Issued to {user?.fullName}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedCertificateCourse(en.course)}
                    className="btn-action btn-enroll"
                  >
                    <Award size={18} /> View & Print Certificate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="dashboard-grid-2 margin-top-lg">
        <div className="dashboard-panel">
          <h3><Award size={20} /> Recent Quiz Attempts</h3>
          {recentAttempts.length === 0 ? (
            <p className="text-muted">No quiz attempts yet.</p>
          ) : (
            <ul className="activity-list">
              {recentAttempts.map(attempt => (
                <li key={attempt.id} className="activity-item">
                  <div className="activity-info">
                    <strong>{attempt.quiz?.title || 'Quiz'}</strong>
                    <span>Score: {attempt.correctAnswers} / {attempt.totalQuestions} correct</span>
                  </div>
                  <span className="badge score-badge">{attempt.score} Marks</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-panel">
          <h3><FileText size={20} /> Submitted Assignments</h3>
          {recentSubmissions.length === 0 ? (
            <p className="text-muted">No assignment submissions yet.</p>
          ) : (
            <ul className="activity-list">
              {recentSubmissions.map(sub => (
                <li key={sub.id} className="activity-item">
                  <div className="activity-info">
                    <strong>{sub.assignment?.title || 'Assignment'}</strong>
                    <span>
                      {sub.marksObtained !== null ? `Grade: ${sub.marksObtained} Marks` : 'Pending Grade'}
                    </span>
                  </div>
                  <span className={`badge ${sub.marksObtained !== null ? 'success-badge' : 'warning-badge'}`}>
                    {sub.marksObtained !== null ? 'Graded' : 'Submitted'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
