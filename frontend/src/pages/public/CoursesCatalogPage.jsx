import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import CourseCard from '../../components/CourseCard';
import { Search, Filter, Globe, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CoursesCatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    Promise.all([
      axiosClient.get('/public/courses'),
      axiosClient.get('/public/categories')
    ])
      .then(([resCourses, resCategories]) => {
        setCourses(resCourses.data);
        setCategories(resCategories.data);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'ROLE_STUDENT') {
      alert('Only registered students can enroll in courses.');
      return;
    }

    try {
      await axiosClient.post(`/student/enroll/${courseId}`);
      navigate(`/student/courses/${courseId}/player`);
    } catch (err) {
      // If already enrolled, directly open the Course Player!
      navigate(`/student/courses/${courseId}/player`);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                          (course.description && course.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCat = selectedCategory === 'all' || 
                       (course.category && course.category.id.toString() === selectedCategory);
    
    const matchesLang = selectedLanguage === 'all' || 
                        (course.language && course.language.toLowerCase() === selectedLanguage.toLowerCase());
    
    const matchesDiff = selectedDifficulty === 'all' || 
                        (course.difficultyLevel && course.difficultyLevel.toLowerCase() === selectedDifficulty.toLowerCase());

    return matchesSearch && matchesCat && matchesLang && matchesDiff;
  });

  return (
    <div className="catalog-page-container">
      <div className="catalog-header">
        <h1>Course Catalog & Learning Resources</h1>
        <p>Search and filter low-bandwidth optimized courses designed for rural education.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-controls-card">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search math, science, agriculture, computers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <Filter size={16} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Globe size={16} />
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>

          <div className="filter-group">
            <BookOpen size={16} />
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List Grid */}
      {loading ? (
        <div className="loading-spinner">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-results">
          <h3>No courses found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesCatalogPage;
