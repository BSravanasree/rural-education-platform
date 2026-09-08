import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LowBandwidthProvider } from './context/LowBandwidthContext';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import CoursesCatalogPage from './pages/public/CoursesCatalogPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import QuizzesPage from './pages/public/QuizzesPage';
import TeachersPage from './pages/public/TeachersPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';

import StudentDashboard from './pages/student/StudentDashboard';
import CoursePlayerPage from './pages/student/CoursePlayerPage';
import FlashcardsPage from './pages/student/FlashcardsPage';

import ParentPortalPage from './pages/public/ParentPortalPage';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CourseEditorPage from './pages/teacher/CourseEditorPage';

import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

// Protected Route wrappers
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-spinner">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesCatalogPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/parent-portal" element={<ParentPortalPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Student Protected Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/courses/:courseId/player" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                <CoursePlayerPage />
              </ProtectedRoute>
            } 
          />

          {/* Teacher Protected Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER', 'ROLE_ADMIN']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/courses/new" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER', 'ROLE_ADMIN']}>
                <CourseEditorPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 Rural Education Platform — Bridging the Educational Gap for Rural Students.</p>
          <div className="footer-links">
            <Link to="/about" style={{ color: 'inherit', textDecoration: 'underline' }}>About</Link>
            <Link to="/faq" style={{ color: 'inherit', textDecoration: 'underline' }}>FAQ</Link>
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'underline' }}>Contact</Link>
            <span className="badge">Low-Bandwidth Optimized</span>
            <span className="badge">Multilingual i18n</span>
            <span className="badge">CSE Final Year Academic Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <LowBandwidthProvider>
            <AppRoutes />
          </LowBandwidthProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
