import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Award, CheckCircle, Clock, FileText, Search, ArrowLeft, RefreshCw, HelpCircle, Check, X, ShieldAlert } from 'lucide-react';

const QuizzesPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Quiz State for active taking
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    setLoading(true);
    axiosClient.get('/public/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  };

  const handleStartQuiz = async (quizId) => {
    setActiveQuiz(null);
    setQuizResult(null);
    setUserAnswers({});
    try {
      const res = await axiosClient.get(`/public/quizzes/${quizId}`);
      setActiveQuiz(res.data.quiz);
      setQuestions(res.data.questions || []);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      alert('Could not load quiz questions. Please try again.');
    }
  };

  const handleOptionSelect = (questionId, optionKey) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (!activeQuiz) return;
    
    setSubmitting(true);

    // If logged in student, post to API for saved attempt
    if (user && user.role === 'ROLE_STUDENT') {
      try {
        const res = await axiosClient.post(`/student/quizzes/${activeQuiz.id}/submit`, userAnswers);
        setQuizResult(res.data);
      } catch (err) {
        calculateLocalResult();
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local Instant Grading for preview
      calculateLocalResult();
      setSubmitting(false);
    }
  };

  const calculateLocalResult = () => {
    let correctCount = 0;
    let totalScore = 0;
    questions.forEach(q => {
      const selected = userAnswers[q.getId ? q.getId() : q.id];
      if (selected && selected.toLowerCase() === (q.correctOption || '').toLowerCase()) {
        correctCount++;
        totalScore += (q.points || 10);
      }
    });

    const totalPossible = questions.length * 10;
    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    setQuizResult({
      score: totalScore,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      percentage: percentage,
      message: percentage >= 60 ? 'Congratulations! Excellent understanding!' : 'Keep practicing to improve your score!'
    });
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="quizzes-page-container main-content">
      {/* Active Quiz Taking Box */}
      {activeQuiz ? (
        <div className="quiz-taking-box-modern margin-bottom-lg">
          <button 
            type="button" 
            onClick={() => { setActiveQuiz(null); setQuizResult(null); }} 
            className="btn-secondary margin-bottom-md"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.88rem' }}
          >
            <ArrowLeft size={16} /> Back to All Quizzes
          </button>

          {!quizResult ? (
            <div>
              <div className="quiz-box-header-modern">
                <div>
                  <h2>{activeQuiz.title}</h2>
                  <p className="text-muted">Answer all questions and submit to view your auto-graded score.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className="badge badge-green"><HelpCircle size={14} /> {questions.length} Questions</span>
                  <span className="badge badge-amber"><Clock size={14} /> {activeQuiz.durationMinutes || 30} Mins</span>
                </div>
              </div>

              <form onSubmit={handleSubmitQuiz}>
                {questions.length === 0 ? (
                  <p className="text-muted">No questions found in this quiz.</p>
                ) : (
                  questions.map((q, idx) => {
                    const qId = q.id;
                    const selected = userAnswers[qId];

                    return (
                      <div key={qId} className="question-card-modern">
                        <div className="question-header">
                          <span className="question-number-badge">Question {idx + 1} of {questions.length}</span>
                          <span className="points-badge">+{q.points || 10} Points</span>
                        </div>
                        <h4 className="question-text-modern">{q.questionText}</h4>

                        <div className="options-grid-modern">
                          {['A', 'B', 'C', 'D'].map((optKey) => {
                            const optionText = q[`option${optKey}`];
                            if (!optionText) return null;
                            const isSelected = selected === optKey;

                            return (
                              <div 
                                key={optKey}
                                className={`option-card-modern ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(qId, optKey)}
                              >
                                <span className={`option-circle ${isSelected ? 'active' : ''}`}>{optKey}</span>
                                <span className="option-text-content">{optionText}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}

                {questions.length > 0 && (
                  <div className="quiz-submit-footer">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="btn-primary-lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {submitting ? 'Evaluating Answers...' : 'Submit Quiz & Check Score'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* Quiz Score Results Banner */
            <div className="quiz-result-banner-modern">
              <div className="result-icon-circle">
                <Award size={48} />
              </div>

              <h2>Quiz Performance Summary</h2>
              <p className="text-muted">{quizResult.message}</p>

              <div className="score-summary-box">
                <div className="score-big">
                  {quizResult.score} <span className="score-label">Points</span>
                </div>
                <div className="score-percentage-badge">
                  {quizResult.correctAnswers} / {quizResult.totalQuestions} Correct Answers ({quizResult.percentage || Math.round((quizResult.correctAnswers / Math.max(1, quizResult.totalQuestions)) * 100)}%)
                </div>
              </div>

              <div className="result-actions">
                <button 
                  type="button" 
                  onClick={() => handleStartQuiz(activeQuiz.id)} 
                  className="btn-secondary"
                >
                  <RefreshCw size={16} /> Retake Quiz
                </button>
                <button 
                  type="button" 
                  onClick={() => { setActiveQuiz(null); setQuizResult(null); }} 
                  className="btn-primary"
                >
                  Browse Other Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quizzes Main Catalog View */
        <div>
          <div className="catalog-header">
            <h1><Award className="icon-main" size={32} style={{ display: 'inline', verticalAlign: 'sub', marginRight: '8px' }} /> Interactive Quizzes & Practice Hub</h1>
            <p>Test your conceptual understanding, earn instant marks, and track your learning performance.</p>
          </div>

          {/* Search Bar */}
          <div className="filter-controls-card margin-bottom-lg">
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search quizzes by title, subject, or lesson..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quizzes List Grid */}
          {loading ? (
            <div className="loading-spinner">Loading available quizzes...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="no-results">
              <h3>No Quizzes Found</h3>
              <p>Check back soon as teachers add more practice quizzes to courses!</p>
            </div>
          ) : (
            <div className="quiz-list-grid">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card-modern">
                  <div className="quiz-card-header">
                    <span className="badge category-badge">Auto-Graded Quiz</span>
                    <h4>{quiz.title}</h4>
                  </div>

                  <div className="quiz-meta-info">
                    <span><Clock size={14} /> {quiz.durationMinutes || 30} Minutes</span>
                    <span><Award size={14} /> {quiz.totalMarks || 100} Total Marks</span>
                  </div>

                  <button 
                    onClick={() => handleStartQuiz(quiz.id)} 
                    className="btn-action btn-enroll"
                  >
                    Start Quiz Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
