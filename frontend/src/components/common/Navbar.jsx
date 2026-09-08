import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, User, LogOut, LayoutDashboard, Compass, HelpCircle, PhoneCall, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_STUDENT') return '/student/dashboard';
    if (user.role === 'ROLE_TEACHER') return '/teacher/dashboard';
    if (user.role === 'ROLE_ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="container flex-between">
        <Link to="/" className="navbar-brand">
          <BookOpen className="text-emerald" size={28} color="#059669" />
          <span>Rural</span>Edu
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/courses" className={`nav-link ${location.pathname.startsWith('/courses') ? 'active' : ''}`}>
              Browse Courses
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About Mission
            </Link>
          </li>
          <li>
            <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              Contact Us
            </Link>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
