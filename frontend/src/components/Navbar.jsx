import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLowBandwidth } from '../context/LowBandwidthContext';
import { BookOpen, Globe, WifiOff, LogOut, User, Shield, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isLowBandwidth, toggleLowBandwidth } = useLowBandwidth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <BookOpen className="icon-main" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-title">{t('appTitle')}</span>
            <span className="brand-subtitle">{t('appTagline')}</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/courses" className="nav-item">{t('nav.courses')}</Link>
          <Link to="/flashcards" className="nav-item">🎴 Flashcards</Link>
          <Link to="/parent-portal" className="nav-item">👨‍👩‍👧 Parent Portal</Link>
          <Link to="/about" className="nav-item">{t('nav.about')}</Link>
          <Link to="/faq" className="nav-item">FAQ</Link>
          <Link to="/contact" className="nav-item">{t('nav.contact')}</Link>

          {/* Low Bandwidth Toggle */}
          <button 
            type="button" 
            className={`low-bw-btn ${isLowBandwidth ? 'active' : ''}`}
            onClick={toggleLowBandwidth}
            title={t('lowBandwidth.toggleLabel')}
          >
            <WifiOff size={16} />
            <span>{isLowBandwidth ? t('lowBandwidth.activeBadge') : 'Standard Mode'}</span>
          </button>

          {/* Language Selector */}
          <div className="language-selector">
            <Globe size={18} className="lang-icon" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
              aria-label="Select Language"
            >
              <option value="en">English (EN)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Authentication Links */}
          {user ? (
            <div className="user-menu">
              {user.role === 'ROLE_STUDENT' && (
                <Link to="/student/dashboard" className="nav-btn btn-secondary">
                  <GraduationCap size={18} /> {t('nav.dashboard')}
                </Link>
              )}
              {user.role === 'ROLE_TEACHER' && (
                <Link to="/teacher/dashboard" className="nav-btn btn-secondary">
                  <User size={18} /> Teacher Hub
                </Link>
              )}
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin/dashboard" className="nav-btn btn-secondary">
                  <Shield size={18} /> Admin Console
                </Link>
              )}

              <button onClick={handleLogout} className="logout-btn" title={t('nav.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-link">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
