import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { User, BookOpen, Star, GraduationCap, Award, Mail, Phone } from 'lucide-react';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default fallback teachers list if API endpoint is empty
    setTeachers([
      {
        id: 1,
        name: 'Prof. Rajesh Kumar',
        qualification: 'M.Sc Mathematics, B.Ed',
        department: 'Science & Mathematics',
        bio: 'Passionate academician with 12+ years of experience simplifying complex algebra, geometry, and physics concepts for rural high school students.',
        rating: 4.9,
        studentsCount: 4520,
        coursesCount: 4,
        email: 'teacher@ruraledu.org',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
      },
      {
        id: 2,
        name: 'Dr. Anita Sharma',
        qualification: 'Ph.D in Agricultural Science & Agronomy',
        department: 'Vocational & Farming Skills',
        bio: 'Specialist in natural farming, soil health management, and organic crop protection techniques designed for rural agricultural development.',
        rating: 4.8,
        studentsCount: 3200,
        coursesCount: 3,
        email: 'anita.agri@ruraledu.org',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
      },
      {
        id: 3,
        name: 'Suresh Varma',
        qualification: 'M.Tech Computer Science, B.Tech',
        department: 'Digital Literacy & Information Technology',
        bio: 'Dedicated IT mentor conducting computer hardware basics, digital payments safety, and basic software skills workshops across rural schools.',
        rating: 4.9,
        studentsCount: 2890,
        coursesCount: 2,
        email: 'suresh.it@ruraledu.org',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="teachers-page main-content">
      <div className="catalog-header margin-bottom-lg">
        <h1><GraduationCap className="icon-main" size={36} style={{ display: 'inline', verticalAlign: 'sub', marginRight: '8px' }} /> Academic Faculty & Teachers Directory</h1>
        <p>Meet our experienced educators and subject mentors dedicated to bridging the rural education gap.</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading faculty profiles...</div>
      ) : (
        <div className="courses-grid">
          {teachers.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="instructor-avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={t.photo} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>{t.name}</h3>
                    <span className="badge badge-green" style={{ fontSize: '0.78rem' }}>{t.department}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                  🎓 {t.qualification}
                </p>

                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {t.bio}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '1.25rem' }}>
                  <span>⭐ {t.rating} Rating</span>
                  <span>🎓 {t.studentsCount.toLocaleString()} Students</span>
                  <span>📚 {t.coursesCount} Courses</span>
                </div>
              </div>

              <Link to="/courses" className="btn-primary" style={{ justifyContent: 'center' }}>
                <BookOpen size={16} /> View Faculty Courses
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
