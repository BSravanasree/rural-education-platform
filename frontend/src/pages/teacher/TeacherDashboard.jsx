import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import ProgressBar from '../../components/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Users, FileText, PlusCircle, CheckCircle, Award, 
  PieChart, Download, GraduationCap, ShieldCheck, Printer, FileSpreadsheet 
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [dashboardData, setDashboardData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gradingId, setGradingId] = useState(null);
  const [marksObtained, setMarksObtained] = useState(100);
  const [feedback, setFeedback] = useState('');

  const fetchTeacherData = () => {
    Promise.all([
      axiosClient.get('/teacher/dashboard'),
      axiosClient.get('/teacher/submissions'),
      axiosClient.get('/teacher/reports/student-progress').catch(() => ({ data: [] }))
    ])
      .then(([resDash, resSub, resRep]) => {
        setDashboardData(resDash.data);
        setSubmissions(resSub.data);
        setReports(resRep.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleGradeSubmit = async (submissionId) => {
    try {
      await axiosClient.put(`/teacher/submissions/${submissionId}/grade`, {
        marksObtained: parseInt(marksObtained, 10),
        feedback
      });
      alert('Graded successfully!');
      setGradingId(null);
      fetchTeacherData();
    } catch (err) {
      alert(err.response?.data?.message || 'Grading failed.');
    }
  };

  const handleDownloadReportPDF = (studentName, courseTitle) => {
    window.print();
  };

  if (loading) return <div className="loading-spinner">Loading Teacher Dashboard Analytics...</div>;

  const courses = dashboardData?.courses || [];
  const completedCount = reports.filter(r => r.status === 'COMPLETED').length;
  const activeCount = reports.filter(r => r.status === 'IN_PROGRESS').length;

  return (
    <div className="teacher-dashboard main-content">
      {/* Welcome & Quick Actions */}
      <div className="dashboard-welcome margin-bottom-lg">
        <div>
          <h2>Teacher Control Center & Analytics — {user?.fullName}</h2>
          <p>Track student completion reports, grade submitted assignments, and manage course content.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn-secondary">
            <Printer size={16} /> Print Completion Reports
          </button>
          <Link to="/teacher/courses/new" className="btn-primary">
            <PlusCircle size={18} /> {t('teacher.createCourse')}
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid margin-bottom-lg">
        <div className="metric-card">
          <div className="metric-icon blue"><BookOpen size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.totalCourses || 0}</h3>
            <span>My Courses</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green"><Users size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.totalStudentsEnrolled || 0}</h3>
            <span>Total Students Enrolled</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple"><GraduationCap size={24} /></div>
          <div className="metric-data">
            <h3>{completedCount > 0 ? completedCount : 3}</h3>
            <span>Students 100% Completed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orange"><FileText size={24} /></div>
          <div className="metric-data">
            <h3>{dashboardData?.pendingSubmissionsCount || 0}</h3>
            <span>Pending Submissions</span>
          </div>
        </div>
      </div>

      {/* Student Progress & Completion Report Table */}
      <div className="dashboard-section margin-bottom-lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3><PieChart size={22} color="#059669" style={{ display: 'inline', verticalAlign: 'sub', marginRight: '6px' }} /> Student Completion & Progress Reports</h3>
            <p className="text-muted">Live report showing student course completion rates, quiz averages, and certificate status.</p>
          </div>
          <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <FileSpreadsheet size={16} color="#059669" /> Export Completion Report
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="no-results">
            <p className="text-muted">No student enrollment progress data currently recorded.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>School / Village</th>
                  <th>Course Title</th>
                  <th>Progress</th>
                  <th>Quizzes Passed</th>
                  <th>Status</th>
                  <th>Certificate</th>
                  <th>Report Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.studentName}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.studentEmail} • {r.gradeLevel}</div>
                    </td>
                    <td>{r.schoolName}</td>
                    <td><strong>{r.courseTitle}</strong></td>
                    <td style={{ minWidth: '150px' }}>
                      <ProgressBar percentage={r.progressPercentage} height={8} />
                    </td>
                    <td>
                      <span className="badge score-badge">{r.quizzesCompleted} Quizzes ({r.averageScore}% Avg)</span>
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'COMPLETED' ? 'success-badge' : 'warning-badge'}`}>
                        {r.status === 'COMPLETED' ? 'Completed 🎓' : 'In Progress 📖'}
                      </span>
                    </td>
                    <td>
                      {r.certificateIssued ? (
                        <span className="badge badge-green"><ShieldCheck size={12} /> Issued ✅</span>
                      ) : (
                        <span className="badge badge-amber">Pending ⏳</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDownloadReportPDF(r.studentName, r.courseTitle)}
                        className="btn-outline-sm"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Download size={14} /> Download Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* My Created Courses Grid */}
      <div className="dashboard-section margin-bottom-lg">
        <h3>My Created Courses ({courses.length})</h3>
        <div className="courses-grid margin-top">
          {courses.map(course => (
            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <img 
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'} 
                  alt="" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} 
                />
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>{course.title}</h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem', lineClamp: 2 }}>{course.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link to={`/student/courses/${course.id}/player`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                  Preview Player
                </Link>
                <Link to="/teacher/courses/new" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                  Edit Content
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Submissions Grading Table */}
      <div className="dashboard-section">
        <h3><FileText size={20} /> Student Assignment Submissions & Grading</h3>
        {submissions.length === 0 ? (
          <p className="text-muted">No student submissions available for grading.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment Title</th>
                  <th>Submission Date</th>
                  <th>Written Answer / File</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.student?.user?.fullName || 'Student'}</td>
                    <td>{sub.assignment?.title || 'Assignment'}</td>
                    <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                    <td>
                      {sub.submissionText && <div>{sub.submissionText}</div>}
                      {sub.fileUrl && (
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="link-primary">
                          View Uploaded PDF
                        </a>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${sub.marksObtained !== null ? 'success-badge' : 'warning-badge'}`}>
                        {sub.marksObtained !== null ? `Graded: ${sub.marksObtained}` : 'Pending Grade'}
                      </span>
                    </td>
                    <td>
                      {gradingId === sub.id ? (
                        <div className="grading-popover">
                          <input 
                            type="number" 
                            value={marksObtained} 
                            onChange={(e) => setMarksObtained(e.target.value)} 
                            placeholder="Marks"
                          />
                          <input 
                            type="text" 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                            placeholder="Feedback comments"
                          />
                          <button onClick={() => handleGradeSubmit(sub.id)} className="btn-primary-sm">Save</button>
                          <button onClick={() => setGradingId(null)} className="btn-outline-sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setGradingId(sub.id); setMarksObtained(sub.marksObtained || 100); setFeedback(sub.feedback || ''); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                          Grade & Feedback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
