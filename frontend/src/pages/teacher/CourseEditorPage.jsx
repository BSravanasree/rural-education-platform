import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import FileUploader from '../../components/FileUploader';
import { PlusCircle, Video, FileText, Award, CheckCircle } from 'lucide-react';

const CourseEditorPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [createdCourse, setCreatedCourse] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState('English');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // Lesson & Content additions
  const [lessonTitle, setLessonTitle] = useState('');
  const [createdLesson, setCreatedLesson] = useState(null);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');

  // Quiz state
  const [quizTitle, setQuizTitle] = useState('');
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState('A');

  useEffect(() => {
    axiosClient.get('/public/categories')
      .then(res => {
        setCategories(res.data);
        if (res.data.length > 0) setCategoryId(res.data[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/teacher/courses', {
        title,
        description,
        categoryId,
        language,
        difficultyLevel,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'
      });
      setCreatedCourse(res.data);
      alert('Course created! Now you can add lessons, videos, notes, and quizzes below.');
    } catch (err) {
      alert('Course creation failed.');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!createdCourse) return;
    try {
      const res = await axiosClient.post(`/teacher/courses/${createdCourse.id}/lessons`, {
        title: lessonTitle,
        sequenceOrder: 1
      });
      setCreatedLesson(res.data);
      alert('Lesson added!');
    } catch (err) {
      alert('Lesson creation failed.');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!createdCourse) return;
    try {
      await axiosClient.post(`/teacher/courses/${createdCourse.id}/videos`, {
        title: videoTitle,
        videoUrl,
        durationSeconds: 300
      });
      alert('Video added to course!');
      setVideoTitle('');
      setVideoUrl('');
    } catch (err) {
      alert('Video addition failed.');
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!createdCourse) return;
    try {
      await axiosClient.post(`/teacher/courses/${createdCourse.id}/materials`, {
        title: materialTitle,
        fileUrl: materialUrl,
        fileType: 'PDF'
      });
      alert('Study material note added!');
      setMaterialTitle('');
      setMaterialUrl('');
    } catch (err) {
      alert('Material addition failed.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!createdLesson) {
      alert('Please create a lesson first to attach the quiz.');
      return;
    }
    try {
      await axiosClient.post('/teacher/quizzes', {
        lessonId: createdLesson.id,
        title: quizTitle,
        totalMarks: 20,
        durationMinutes: 15,
        questions: [
          {
            questionText: qText,
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            correctOption: correctOpt,
            points: 10
          }
        ]
      });
      alert('Quiz created successfully!');
      setQuizTitle('');
      setQText('');
    } catch (err) {
      alert('Quiz creation failed.');
    }
  };

  return (
    <div className="course-editor-container">
      <h2>Create New Learning Course</h2>
      
      {/* Step 1: Course Info */}
      <div className="editor-card">
        <h3>Step 1: Course Details</h3>
        <form onSubmit={handleCreateCourse} className="auth-form grid-2">
          <div className="form-group span-2">
            <label>Course Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Science & Environment for High Schools" />
          </div>

          <div className="form-group span-2">
            <label>Description</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course summary..." />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-select">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-select">
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} className="form-select">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Thumbnail Image URL</label>
            <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Image URL..." />
          </div>

          <div className="form-group span-2">
            <button type="submit" disabled={!!createdCourse} className="btn-primary">
              {createdCourse ? 'Course Saved ✅' : 'Save Course Info'}
            </button>
          </div>
        </form>
      </div>

      {/* Step 2: Lessons & Video / Material Upload */}
      {createdCourse && (
        <div className="editor-card">
          <h3>Step 2: Add Lessons & Content</h3>
          
          <form onSubmit={handleCreateLesson} className="auth-form margin-bottom">
            <div className="form-group">
              <label>Lesson Title</label>
              <input type="text" required value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="e.g. Lesson 1: Cell Biology" />
            </div>
            <button type="submit" className="btn-secondary">Add Lesson</button>
          </form>

          <div className="grid-2 margin-top">
            {/* Add Video */}
            <form onSubmit={handleAddVideo} className="auth-form border-box">
              <h4><Video size={18} /> Add Video Lecture</h4>
              <div className="form-group">
                <label>Video Title</label>
                <input type="text" required value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Lecture 1 Video" />
              </div>
              <div className="form-group">
                <label>Upload / Video URL</label>
                <FileUploader onUploadSuccess={(url) => setVideoUrl(url)} folder="videos" allowedTypes=".mp4,.webm" />
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Or paste video URL..." />
              </div>
              <button type="submit" className="btn-primary-sm">Attach Video</button>
            </form>

            {/* Add Material PDF */}
            <form onSubmit={handleAddMaterial} className="auth-form border-box">
              <h4><FileText size={18} /> Add PDF Notes</h4>
              <div className="form-group">
                <label>Material Title</label>
                <input type="text" required value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} placeholder="Summary PDF Notes" />
              </div>
              <div className="form-group">
                <label>Upload PDF Document</label>
                <FileUploader onUploadSuccess={(url) => setMaterialUrl(url)} folder="materials" allowedTypes=".pdf" />
                <input type="text" value={materialUrl} onChange={(e) => setMaterialUrl(e.target.value)} placeholder="Or paste PDF URL..." />
              </div>
              <button type="submit" className="btn-primary-sm">Attach PDF Material</button>
            </form>
          </div>
        </div>
      )}

      {/* Step 3: Quiz Builder */}
      {createdLesson && (
        <div className="editor-card">
          <h3>Step 3: Create Quiz for Lesson</h3>
          <form onSubmit={handleCreateQuiz} className="auth-form">
            <div className="form-group">
              <label>Quiz Title</label>
              <input type="text" required value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Lesson 1 Quiz" />
            </div>

            <div className="form-group">
              <label>Question Text</label>
              <input type="text" required value={qText} onChange={(e) => setQText(e.target.value)} placeholder="What is the powerhouse of the cell?" />
            </div>

            <div className="grid-2">
              <input type="text" required value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A (e.g. Mitochondria)" />
              <input type="text" required value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B (e.g. Nucleus)" />
              <input type="text" required value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C (e.g. Ribosome)" />
              <input type="text" required value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D (e.g. Cell Wall)" />
            </div>

            <div className="form-group">
              <label>Correct Answer Key</label>
              <select value={correctOpt} onChange={(e) => setCorrectOpt(e.target.value)} className="form-select">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">Create Quiz & Save</button>
          </form>
        </div>
      )}

      <div className="editor-footer">
        <button onClick={() => navigate('/teacher/dashboard')} className="btn-primary-lg">
          Finish & Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CourseEditorPage;
