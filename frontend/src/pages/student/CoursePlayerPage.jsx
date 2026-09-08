import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import VideoPlayer from '../../components/VideoPlayer';
import FileUploader from '../../components/FileUploader';
import ProgressBar from '../../components/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Video, FileText, Award, Send, CheckCircle, Download } from 'lucide-react';

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const { t, currentLanguage } = useLanguage();

  const [playerData, setPlayerData] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentMsg, setAssignmentMsg] = useState('');

  const findVideoForLanguage = (vList, lang) => {
    if (!vList || vList.length === 0) return null;

    if (lang === 'te') {
      return vList.find(v => {
        const title = (v.title || '').toLowerCase();
        const url = (v.videoUrl || '').toLowerCase();
        return title.includes('telugu') || title.includes('తెలుగు') || url.includes('ydg7g08agtg');
      });
    }
    if (lang === 'hi') {
      return vList.find(v => {
        const title = (v.title || '').toLowerCase();
        const url = (v.videoUrl || '').toLowerCase();
        return title.includes('hindi') || title.includes('हिंदी') || url.includes('-udhmstmqtw') || url.includes('8ox44x0k2yg') || url.includes('ihzv-jkjncc');
      });
    }
    if (lang === 'en') {
      return vList.find(v => {
        const title = (v.title || '').toLowerCase();
        const url = (v.videoUrl || '').toLowerCase();
        return title.includes('english') || url.includes('veb22xd0ao0');
      });
    }
    return null;
  };

  const fetchCourseData = () => {
    Promise.all([
      axiosClient.get(`/student/courses/${courseId}/player`),
      axiosClient.get(`/student/progress/${courseId}`)
    ])
      .then(([resPlayer, resProgress]) => {
        setPlayerData(resPlayer.data);
        setProgressStats(resProgress.data);
        const vList = resPlayer.data?.videos || [];
        if (vList.length > 0) {
          const matched = findVideoForLanguage(vList, currentLanguage);
          setSelectedVideo(matched || vList[0]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // Auto-switch video when platform language changes (English, Hindi, Telugu)
  useEffect(() => {
    if (!playerData?.videos || playerData.videos.length === 0) return;
    const matchedVideo = findVideoForLanguage(playerData.videos, currentLanguage);
    if (matchedVideo) {
      setSelectedVideo(matchedVideo);
    }
  }, [currentLanguage, playerData]);

  if (!playerData) return <div className="loading-spinner">Loading Course Content...</div>;

  const { course = {}, lessons = [], videos = [], studyMaterials = [], quizzes = [], assignments = [] } = playerData || {};

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(null);
    setQuizResult(null);
    setQuizAnswers({});
    try {
      const res = await axiosClient.get(`/student/quizzes/${quiz.id}`);
      setSelectedQuiz(res.data);
    } catch (err) {
      alert('Failed to load quiz questions.');
    }
  };

  const handleOptionSelect = (questionId, optionKey) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    setSubmittingQuiz(true);

    try {
      const res = await axiosClient.post(`/student/quizzes/${selectedQuiz.quiz.id}/submit`, quizAnswers);
      setQuizResult(res.data);
      fetchCourseData(); // Refresh progress
    } catch (err) {
      alert('Quiz submission failed.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmittingAssignment(true);

    try {
      await axiosClient.post(`/student/assignments/${selectedAssignment.id}/submit`, {
        submissionText,
        fileUrl: uploadedFileUrl
      });
      setAssignmentMsg('Assignment submitted successfully!');
      fetchCourseData(); // Refresh progress
    } catch (err) {
      alert('Assignment submission failed.');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  return (
    <div className="course-player-container">
      {/* Course Header Banner */}
      <div className="player-header">
        <div>
          <h2>{course?.title || 'Course Player'}</h2>
          <p>{course?.description || 'Course Learning Content'}</p>
        </div>
        <div className="player-header-progress">
          <ProgressBar percentage={progressStats?.progressPercentage || 0} height={12} />
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="player-tabs-bar">
        <button 
          className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          <Video size={18} /> Lectures ({videos.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <FileText size={18} /> Study Notes ({studyMaterials.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          <Award size={18} /> Quizzes ({quizzes.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <Send size={18} /> Assignments ({assignments.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="player-tab-content">
        {/* LECTURES & VIDEO PLAYER */}
        {activeTab === 'lessons' && (
          <div className="video-player-grid">
            <div className="video-main">
              {/* Render Multilingual Language Switcher for Courses with Language Options */}
              {videos.length > 0 && (
                <div className="language-switcher-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>🌐 Switch Lecture Language:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const hiVid = videos.find(v => (v.title || '').toLowerCase().includes('hindi')) || videos[0];
                      if (hiVid) setSelectedVideo(hiVid);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      fontWeight: '600',
                      background: selectedVideo?.title?.toLowerCase().includes('hindi') ? '#1e40af' : '#ffffff',
                      color: selectedVideo?.title?.toLowerCase().includes('hindi') ? '#ffffff' : '#334155'
                    }}
                  >
                    🇮🇳 Hindi (हिंदी)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const teVid = videos.find(v => (v.title || '').toLowerCase().includes('telugu')) || videos[0];
                      if (teVid) setSelectedVideo(teVid);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      fontWeight: '600',
                      background: selectedVideo?.title?.toLowerCase().includes('telugu') ? '#1e40af' : '#ffffff',
                      color: selectedVideo?.title?.toLowerCase().includes('telugu') ? '#ffffff' : '#334155'
                    }}
                  >
                    🇮🇳 Telugu (తెలుగు)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const enVid = videos.find(v => (v.title || '').toLowerCase().includes('english')) || videos[0];
                      if (enVid) setSelectedVideo(enVid);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      fontWeight: '600',
                      background: selectedVideo?.title?.toLowerCase().includes('english') ? '#1e40af' : '#ffffff',
                      color: selectedVideo?.title?.toLowerCase().includes('english') ? '#ffffff' : '#334155'
                    }}
                  >
                    🇬🇧 English (EN)
                  </button>
                </div>
              )}

              {selectedVideo ? (
                <VideoPlayer 
                  videoUrl={selectedVideo.videoUrl} 
                  title={selectedVideo.title} 
                  durationSeconds={selectedVideo.durationSeconds} 
                />
              ) : (
                <div className="empty-state">No video lectures available for this course.</div>
              )}
            </div>

            <div className="video-playlist">
              <h3>Course Lessons & Lectures</h3>
              {lessons.length > 0 && (
                <div className="lessons-list-header margin-bottom-sm">
                  {lessons.map(les => (
                    <div key={les.id} className="badge badge-blue margin-bottom-xs" style={{ display: 'block', textAlign: 'left' }}>
                      📖 {les.title}
                    </div>
                  ))}
                </div>
              )}
              <h4 style={{ fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Video Playlist:</h4>
              {videos.map(v => (
                <div 
                  key={v.id} 
                  className={`playlist-item ${selectedVideo?.id === v.id ? 'active' : ''}`}
                  onClick={() => setSelectedVideo(v)}
                >
                  <Video size={16} />
                  <span>{v.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDY MATERIALS & PDF NOTES */}
        {activeTab === 'materials' && (
          <div className="materials-list">
            <h3>Downloadable Study Materials & PDF Notes</h3>
            {studyMaterials.length === 0 ? (
              <p>No study materials uploaded yet.</p>
            ) : (
              studyMaterials.map(mat => (
                <div key={mat.id} className="material-card">
                  <div className="material-info">
                    <FileText size={24} className="material-icon" />
                    <div>
                      <h4>{mat.title}</h4>
                      <span>Format: {mat.fileType || 'PDF Document'}</span>
                    </div>
                  </div>
                  <a href={mat.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                    <Download size={16} /> Download
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* INTERACTIVE QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="quiz-section">
            {!selectedQuiz ? (
              <div>
                <h3 className="section-title"><Award size={20} /> Interactive Class Quizzes</h3>
                {quizzes.length === 0 ? (
                  <div className="empty-state">No quizzes available for this course yet.</div>
                ) : (
                  <div className="quiz-list-grid">
                    {quizzes.map(q => (
                      <div key={q.id} className="quiz-card-modern">
                        <div className="quiz-card-header">
                          <span className="badge badge-purple">🎯 Interactive Quiz</span>
                          <h4>{q.title}</h4>
                          <p className="quiz-meta-info">
                            <span>⏱️ Duration: <strong>{q.durationMinutes} mins</strong></span>
                            <span>💯 Marks: <strong>{q.totalMarks} Points</strong></span>
                          </p>
                        </div>
                        <button onClick={() => handleSelectQuiz(q)} className="btn-primary-lg full-width">
                          <Award size={18} /> Start Quiz Assessment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-taking-box-modern">
                <div className="quiz-box-header-modern">
                  <div>
                    <span className="badge badge-blue">Exam Mode</span>
                    <h3>{selectedQuiz.quiz?.title}</h3>
                  </div>
                  <button onClick={() => setSelectedQuiz(null)} className="btn-outline">
                    ← Back to Quizzes
                  </button>
                </div>

                {quizResult ? (
                  <div className="quiz-result-banner-modern">
                    <div className="result-icon-circle">
                      <CheckCircle size={48} color="#059669" />
                    </div>
                    <h2>{t('quiz.scoreResult')}</h2>
                    <div className="score-summary-box">
                      <div className="score-big">
                        {quizResult.score} <span className="score-label">Points</span>
                      </div>
                      <p className="score-details">
                        Answered <strong>{quizResult.correctAnswers}</strong> out of <strong>{quizResult.totalQuestions}</strong> questions correctly.
                      </p>
                      <div className="score-percentage-badge">
                        Accuracy: {Math.round((quizResult.correctAnswers / (quizResult.totalQuestions || 1)) * 100)}%
                      </div>
                    </div>
                    <div className="result-actions">
                      <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="btn-secondary">
                        🔄 Retake Quiz
                      </button>
                      <button onClick={() => { setSelectedQuiz(null); setQuizResult(null); }} className="btn-primary">
                        Return to Lessons
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleQuizSubmit} className="quiz-questions-form-modern">
                    {selectedQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="question-card-modern">
                        <div className="question-header">
                          <span className="question-number-badge">Question {idx + 1} of {selectedQuiz.questions.length}</span>
                          <span className="points-badge">+{q.points || 10} Points</span>
                        </div>
                        <h4 className="question-text-modern">{q.questionText}</h4>
                        
                        <div className="options-grid-modern">
                          {['A', 'B', 'C', 'D'].map(opt => {
                            const optionValue = q[`option${opt}`];
                            if (!optionValue) return null;
                            const isSelected = quizAnswers[q.id] === opt;
                            return (
                              <div 
                                key={opt} 
                                className={`option-card-modern ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(q.id, opt)}
                              >
                                <div className={`option-circle ${isSelected ? 'active' : ''}`}>
                                  {opt}
                                </div>
                                <span className="option-text-content">{optionValue}</span>
                                <input 
                                  type="radio" 
                                  name={`question_${q.id}`} 
                                  value={opt}
                                  checked={isSelected}
                                  onChange={() => handleOptionSelect(q.id, opt)}
                                  className="option-radio-hidden"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="quiz-submit-footer">
                      <button type="submit" disabled={submittingQuiz} className="btn-primary-lg full-width">
                        {submittingQuiz ? 'Evaluating Answers...' : 'Submit Quiz Answers'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <h3>Course Assignments</h3>
            {assignments.length === 0 ? (
              <p>No assignments posted yet.</p>
            ) : (
              assignments.map(ass => (
                <div key={ass.id} className="assignment-card">
                  <h4>{ass.title}</h4>
                  <p>{ass.instructions}</p>
                  <div className="assignment-actions">
                    <button 
                      onClick={() => { setSelectedAssignment(ass); setAssignmentMsg(''); }} 
                      className="btn-primary"
                    >
                      Submit Homework
                    </button>
                  </div>
                </div>
              ))
            )}

            {selectedAssignment && (
              <div className="submission-modal-box">
                <h4>Submit Assignment: {selectedAssignment.title}</h4>
                {assignmentMsg ? (
                  <div className="uploader-alert success">{assignmentMsg}</div>
                ) : (
                  <form onSubmit={handleAssignmentSubmit} className="submission-form">
                    <div className="form-group">
                      <label>Written Notes / Response:</label>
                      <textarea 
                        rows="4" 
                        value={submissionText} 
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Write your answer or assignment summary here..."
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Upload Document / PDF:</label>
                      <FileUploader 
                        onUploadSuccess={(url) => setUploadedFileUrl(url)} 
                        folder="assignments" 
                      />
                      {uploadedFileUrl && <span className="text-success">Uploaded file saved!</span>}
                    </div>

                    <button type="submit" disabled={submittingAssignment} className="btn-primary">
                      {submittingAssignment ? 'Submitting...' : 'Submit Work'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
