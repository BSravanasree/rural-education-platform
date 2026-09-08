import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { BookOpen, Globe, User, Zap } from 'lucide-react';

const CourseCard = ({ course, progress, isEnrolled, onEnroll }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = async () => {
    if (onEnroll) {
      onEnroll(course.id);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axiosClient.post(`/student/enroll/${course.id}`);
      navigate(`/student/courses/${course.id}/player`);
    } catch (err) {
      // If already enrolled or role allows, open player directly!
      navigate(`/student/courses/${course.id}/player`);
    }
  };

  return (
    <div className="course-card">
      <div className="course-thumbnail" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img 
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'} 
          alt={course.title} 
          loading="lazy" 
        />
        <div className="course-badges">
          <span className="badge category-badge">{course.category?.name || 'General'}</span>
          <span className="badge lang-badge"><Globe size={12} /> {course.language || 'English'}</span>
          <span className="badge bw-badge"><Zap size={12} /> {t('courseCard.lowBandwidth')}</span>
        </div>
      </div>

      <div className="course-card-body">
        <h3 className="course-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {course.title}
        </h3>
        <p className="course-desc">{course.description}</p>
        
        <div className="course-meta">
          <span className="teacher-info">
            <User size={14} /> {course.teacher?.user?.fullName || 'Instructor'}
          </span>
          <span className="level-info">
            {course.difficultyLevel ? (t(`courseCard.${course.difficultyLevel.toLowerCase()}`) || course.difficultyLevel) : t('courseCard.beginner')}
          </span>
        </div>

        {progress !== undefined && progress !== null && (
          <div className="course-progress-section">
            <ProgressBar percentage={progress} height={8} />
          </div>
        )}

        <div className="course-card-actions">
          {isEnrolled ? (
            <button onClick={handleCardClick} className="btn-action btn-learn">
              <BookOpen size={16} /> {t('student.continueLearning')}
            </button>
          ) : (
            <button onClick={handleCardClick} className="btn-action btn-enroll">
              <BookOpen size={16} /> Start Learning & View Videos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
