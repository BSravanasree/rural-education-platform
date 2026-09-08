import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { BookOpen, Video, FileText, Award, Users, CheckCircle, ArrowRight, Star, WifiOff } from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalCategories: 0 });
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/public/stats').then(res => setStats(res.data)).catch(err => console.error(err));
    api.get('/public/courses').then(res => setCourses(res.data.slice(0, 3))).catch(err => console.error(err));
    api.get('/public/testimonials').then(res => setTestimonials(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '1rem' }}>
              <CheckCircle size={14} /> Empowering Rural Youth
            </div>
            <h1 className="hero-title">
              Quality Education for <span>Every Rural Student</span>
            </h1>
            <p className="hero-subtitle">
              Access high-quality video lectures, downloadable PDF notes, interactive quizzes, and assignments designed for low-bandwidth environments.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary">
                Browse Free Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Join as Student / Teacher
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80" 
              alt="Rural Classroom" 
              style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '4px solid white' }}
            />
            <div className="glass-card" style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award color="#059669" size={32} />
              <div>
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Recognized LMS</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>100% Free & Open Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ background: 'white', padding: '2.5rem 0', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="container grid-4" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-600)' }}>{stats.totalUsers || 150}+</h2>
            <p style={{ fontWeight: 600, color: 'var(--neutral-600)' }}>Active Students & Teachers</p>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-600)' }}>{stats.totalCourses || 12}+</h2>
            <p style={{ fontWeight: 600, color: 'var(--neutral-600)' }}>Structured Courses</p>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--amber-500)' }}>{stats.totalCategories || 5}</h2>
            <p style={{ fontWeight: 600, color: 'var(--neutral-600)' }}>Learning Categories</p>
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-700)' }}>100%</h2>
            <p style={{ fontWeight: 600, color: 'var(--neutral-600)' }}>Free Learning Access</p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-blue">Built for Low Bandwidth</span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.6rem' }}>Why Choose RuralEdu?</h2>
        </div>

        <div className="grid-3">
          <div className="card">
            <Video size={40} color="#059669" style={{ marginBottom: '1rem' }} />
            <h3>Video Lectures</h3>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.5rem' }}>
              Stream or watch high-clarity video lectures optimized for 2G/3G low-bandwidth connections.
            </p>
          </div>

          <div className="card">
            <FileText size={40} color="#0284c7" style={{ marginBottom: '1rem' }} />
            <h3>Download PDF Notes</h3>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.5rem' }}>
              Download lightweight study notes and formula sheets for offline reading on mobile devices.
            </p>
          </div>

          <div className="card">
            <Award size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h3>Quizzes & Certificates</h3>
            <p style={{ color: 'var(--neutral-600)', marginTop: '0.5rem' }}>
              Test your understanding with instant auto-graded quizzes and earn certificates of achievement.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ background: 'var(--neutral-100)', padding: '5rem 0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-green">Featured Catalog</span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.4rem' }}>Popular Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-secondary btn-sm">View All Courses</Link>
          </div>

          <div className="grid-3">
            {courses.map(course => (
              <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img 
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'} 
                  alt={course.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <div>
                    <span className="badge badge-blue">{course.category ? course.category.name : 'General'}</span>
                    <h3 style={{ fontSize: '1.2rem', margin: '0.6rem 0' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
                      {course.description.length > 90 ? course.description.substring(0, 90) + '...' : course.description}
                    </p>
                  </div>
                  <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)' }}>
                      By {course.teacher ? course.teacher.user.fullName : 'Faculty'}
                    </span>
                    <Link to="/login" className="btn btn-primary btn-sm">Enroll Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-amber">Success Stories</span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>What Students & Teachers Say</h2>
        </div>

        <div className="grid-2">
          {testimonials.map(t => (
            <div key={t.id} className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--neutral-700)' }}>
                "{t.content}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={t.avatarUrl || 'https://randomuser.me/api/portraits/women/44.jpg'} alt={t.authorName} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>{t.authorName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>{t.roleDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
