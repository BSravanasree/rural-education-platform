import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else if (data.role === 'ROLE_TEACHER') {
        navigate('/teacher/dashboard');
      } else if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const data = await login(demoEmail, demoPassword);
      if (data.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else if (data.role === 'ROLE_TEACHER') {
        navigate('/teacher/dashboard');
      } else if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <LogIn size={32} className="auth-icon" />
          <h2>{t('auth.loginTitle')}</h2>
          <p>Sign in to access your courses, teaching portal, or admin dashboard</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px'
        }}>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('student@ruraledu.org', 'student123')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              background: email === 'student@ruraledu.org' ? '#059669' : 'transparent',
              color: email === 'student@ruraledu.org' ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            🎓 Student
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('teacher@ruraledu.org', 'teacher123')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              background: email === 'teacher@ruraledu.org' ? '#059669' : 'transparent',
              color: email === 'teacher@ruraledu.org' ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            👨‍🏫 Teacher
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('admin@ruraledu.org', 'admin123')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              background: email === 'admin@ruraledu.org' ? '#059669' : 'transparent',
              color: email === 'admin@ruraledu.org' ? '#ffffff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            🛡️ Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('auth.emailLabel')}</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="student@ruraledu.org"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.passwordLabel')}</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary-full">
            {loading ? 'Authenticating...' : t('auth.loginBtn')}
          </button>
        </form>

        <div className="auth-card-footer">
          <span>{t('auth.noAccount')}</span>
          <Link to="/register" className="auth-switch-link">{t('nav.register')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
