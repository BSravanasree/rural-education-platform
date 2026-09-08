import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserPlus, Mail, Lock, User, School, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const { registerStudent } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gradeLevel: 'Class 10',
    schoolName: '',
    villageDistrict: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Role is fixed to STUDENT on public registration
      await registerStudent({ ...formData, role: 'ROLE_STUDENT' });
      setSuccess('Student registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card wide">
        <div className="auth-card-header">
          <UserPlus size={32} className="auth-icon" />
          <h2>{t('auth.registerTitle')}</h2>
          <p className="security-note">Public registration creates Student accounts only. Teacher accounts are created by Administrators.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="auth-success-banner">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form grid-2">
          <div className="form-group">
            <label>{t('auth.fullNameLabel')}</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                type="text" 
                name="fullName" 
                required 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="Ananya Sharma"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.emailLabel')}</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="ananya@ruraledu.org"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.passwordLabel')}</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.phoneLabel')}</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.gradeLevelLabel')}</label>
            <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="form-select">
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t('auth.schoolNameLabel')}</label>
            <div className="input-with-icon">
              <School size={18} />
              <input 
                type="text" 
                name="schoolName" 
                value={formData.schoolName} 
                onChange={handleChange} 
                placeholder="Govt High School Rampur"
              />
            </div>
          </div>

          <div className="form-group span-2">
            <label>{t('auth.villageDistrictLabel')}</label>
            <div className="input-with-icon">
              <MapPin size={18} />
              <input 
                type="text" 
                name="villageDistrict" 
                value={formData.villageDistrict} 
                onChange={handleChange} 
                placeholder="Rampur Village, MP"
              />
            </div>
          </div>

          <div className="form-group span-2">
            <button type="submit" disabled={loading} className="btn-primary-full">
              {loading ? 'Creating Account...' : t('auth.registerBtn')}
            </button>
          </div>
        </form>

        <div className="auth-card-footer">
          <span>{t('auth.haveAccount')}</span>
          <Link to="/login" className="auth-switch-link">{t('nav.login')}</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
