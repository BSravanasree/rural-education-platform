import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--neutral-900)', color: 'var(--neutral-300)', padding: '4rem 0 2rem 0', marginTop: '4rem' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
              <BookOpen color="#10b981" size={28} /> RuralEdu
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--neutral-400)', lineHeight: '1.7' }}>
              Empowering students in remote and rural communities with free, high-quality, video & note-based digital education.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: 'var(--neutral-400)' }}>Home</Link></li>
              <li><Link to="/courses" style={{ color: 'var(--neutral-400)' }}>Browse Courses</Link></li>
              <li><Link to="/about" style={{ color: 'var(--neutral-400)' }}>Our Mission</Link></li>
              <li><Link to="/faq" style={{ color: 'var(--neutral-400)' }}>Frequently Asked Questions</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Roles & Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/login" style={{ color: 'var(--neutral-400)' }}>Student Portal</Link></li>
              <li><Link to="/login" style={{ color: 'var(--neutral-400)' }}>Teacher Portal</Link></li>
              <li><Link to="/login" style={{ color: 'var(--neutral-400)' }}>Administrator Console</Link></li>
              <li><Link to="/register" style={{ color: 'var(--neutral-400)' }}>Join as Teacher</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1.2rem' }}>Contact & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <MapPin size={16} color="#10b981" /> Rural Learning Center, Bhopal, MP
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={16} color="#10b981" /> support@ruraledu.org
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={16} color="#10b981" /> +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--neutral-800)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>
          © {new Date().getFullYear()} Rural Education Platform. Bridging the Urban-Rural Education Divide.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
