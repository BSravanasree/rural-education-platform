import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Globe, User, Zap, Star, Award, CheckCircle, Clock, 
  PlayCircle, FileText, ChevronDown, ChevronUp, ShieldCheck, ArrowRight, Share2 
} from 'lucide-react';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [videos, setVideos] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    setLoading(true);
    // Fetch course info along with lessons & materials
    axiosClient.get(`/public/courses/${courseId}`)
      .then(res => {
        setCourse(res.data);
        // Fetch course player content to show full curriculum preview
        return axiosClient.get(`/student/courses/${courseId}/player`).catch(() => null);
      })
      .then(playerRes => {
        if (playerRes && playerRes.data) {
          setLessons(playerRes.data.lessons || []);
          setVideos(playerRes.data.videos || []);
          setStudyMaterials(playerRes.data.studyMaterials || []);
          
          // Expand first lesson by default
          if (playerRes.data.lessons && playerRes.data.lessons.length > 0) {
            setExpandedLessons({ [playerRes.data.lessons[0].id]: true });
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  const toggleLessonAccordion = (lessonId) => {
    setExpandedLessons(prev => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'ROLE_STUDENT' && user.role !== 'ROLE_ADMIN') {
      alert('Only registered students can enroll in courses.');
      return;
    }

    setEnrolling(true);
    try {
      await axiosClient.post(`/student/enroll/${courseId}`);
      navigate(`/student/courses/${courseId}/player`);
    } catch (err) {
      // If already enrolled, open player
      navigate(`/student/courses/${courseId}/player`);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="loading-spinner main-content">Loading Course Details...</div>;
  if (!course) return <div className="main-content"><h3>Course not found.</h3></div>;

  const rating = (4.7 + (course.id % 4) * 0.1).toFixed(1);
  const reviewCount = 1240 + (course.id * 85);

  return (
    <div className="course-detail-page">
      {/* Udemy Header Hero */}
      <section className="udemy-hero-banner">
        <div className="main-content udemy-hero-grid">
          <div className="udemy-hero-info">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge udemy-bestseller-badge">Bestseller</span>
              <span className="badge category-badge">{course.category?.name || 'General'}</span>
              <span className="badge lang-badge"><Globe size={12} /> {course.language || 'English'}</span>
              <span className="badge bw-badge"><Zap size={12} /> Low-Bandwidth Optimized</span>
            </div>

            <h1 className="udemy-course-title">{course.title}</h1>
            <p className="udemy-course-subtitle">{course.description}</p>

            <div className="udemy-rating-bar">
              <span className="rating-score">{rating}</span>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
              </div>
              <span style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>({reviewCount.toLocaleString()} ratings)</span>
              <span style={{ color: '#e0e7ff', fontSize: '0.9rem' }}>• 4,520 Students Enrolled</span>
            </div>

            <div className="udemy-meta-list">
              <span>Created by <strong style={{ color: '#ffffff' }}>{course.teacher?.user?.fullName || 'Academic Faculty'}</strong></span>
              <span>• Last updated 09/2026</span>
              <span>• Multilingual Audio Subtitles (Tamil, Telugu, Hindi, English)</span>
            </div>
          </div>

          {/* Sticky Enrollment Card Sidebar */}
          <div className="udemy-sidebar-card">
            <div className="sidebar-thumbnail">
              <img 
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80'} 
                alt={course.title} 
              />
              <div className="play-overlay">
                <PlayCircle size={48} color="#ffffff" />
              </div>
            </div>

            <div className="sidebar-body">
              <div className="sidebar-price-row">
                <span className="price-free">FREE ACCESS</span>
                <span className="price-original">100% Scholarship Sponsored</span>
              </div>

              <button 
                onClick={handleEnroll} 
                disabled={enrolling} 
                className="btn-primary-full margin-bottom-md"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '0.95rem', fontSize: '1.05rem' }}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now — Start Learning'} <ArrowRight size={18} />
              </button>

              <div className="course-includes-list">
                <h4>This course includes:</h4>
                <ul>
                  <li><PlayCircle size={16} /> High-Definition & Low-Bandwidth Video Lectures</li>
                  <li><FileText size={16} /> Downloadable PDF Study Notes & Worksheets</li>
                  <li><Award size={16} /> Auto-graded Quizzes & Self-Assessment Tests</li>
                  <li><ShieldCheck size={16} /> Official Certificate of Completion</li>
                  <li><Globe size={16} /> Multilingual Audio Tracks (Tamil, Telugu, Hindi, English)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="main-content udemy-detail-body">
        <div className="udemy-main-left">
          {/* What You'll Learn Box */}
          <div className="what-you-learn-box margin-bottom-lg">
            <h3>What you'll learn in this course</h3>
            <div className="learn-grid">
              <div className="learn-item"><CheckCircle size={18} className="check-icon" /> Master fundamental concepts step-by-step from beginner to advanced level.</div>
              <div className="learn-item"><CheckCircle size={18} className="check-icon" /> Solve real-world problem sets and practical exercises tailored for exams.</div>
              <div className="learn-item"><CheckCircle size={18} className="check-icon" /> Access low-data compressed video streams and offline downloadable PDF notes.</div>
              <div className="learn-item"><CheckCircle size={18} className="check-icon" /> Test your understanding with auto-graded quizzes and earn completion certificates.</div>
            </div>
          </div>

          {/* Course Curriculum Accordion */}
          <div className="curriculum-section margin-bottom-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Course Content & Curriculum</h3>
              <span className="text-muted" style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {lessons.length} Modules • {videos.length} Lectures • {studyMaterials.length} Study Notes
              </span>
            </div>

            {lessons.length === 0 ? (
              <p className="text-muted">Curriculum modules loading...</p>
            ) : (
              <div className="accordion-container">
                {lessons.map((lesson, idx) => {
                  const isExpanded = expandedLessons[lesson.id];
                  const lessonVideos = videos.filter(v => v.lesson?.id === lesson.id || !v.lesson);
                  const lessonNotes = studyMaterials.filter(m => m.lesson?.id === lesson.id || !m.lesson);

                  return (
                    <div key={lesson.id} className="accordion-item margin-bottom-sm">
                      <div className="accordion-header" onClick={() => toggleLessonAccordion(lesson.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          <strong style={{ fontSize: '1.05rem' }}>Section {idx + 1}: {lesson.title}</strong>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {lessonVideos.length} lectures
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="accordion-body">
                          {lesson.description && <p className="text-muted margin-bottom-sm">{lesson.description}</p>}
                          
                          <ul className="lecture-item-list">
                            {lessonVideos.map((vid) => (
                              <li key={vid.id} className="lecture-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <PlayCircle size={16} color="#059669" />
                                  <span>{vid.title}</span>
                                </div>
                                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>Video Lecture</span>
                              </li>
                            ))}

                            {lessonNotes.map((note) => (
                              <li key={note.id} className="lecture-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <FileText size={16} color="#4f46e5" />
                                  <span>{note.title}</span>
                                </div>
                                <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>PDF Note</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructor Profile Card */}
          <div className="instructor-card margin-bottom-lg">
            <h3>Instructor Details</h3>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginTop: '1rem' }}>
              <div className="instructor-avatar">
                <User size={36} color="#059669" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{course.teacher?.user?.fullName || 'Senior Academic Faculty'}</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Subject Specialist & Rural Education Mentor</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>
                  <span>⭐ {rating} Instructor Rating</span>
                  <span>🎓 4,500+ Students</span>
                  <span>📚 {lessons.length > 0 ? lessons.length : 4} Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
