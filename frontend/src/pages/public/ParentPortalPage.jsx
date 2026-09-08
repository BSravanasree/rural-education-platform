import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
  Users, Search, Award, CheckCircle2, Flame, GraduationCap, 
  Printer, BookOpen, AlertCircle, ShieldCheck, Heart 
} from 'lucide-react';

const ParentPortalPage = () => {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('te'); // 'te', 'hi', 'en'

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);
    setReport(null);

    try {
      const res = await axiosClient.get(`/public/parent/student-report?query=${encodeURIComponent(query.trim())}`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No student found matching that email or ID. Try typing "student@ruraledu.org"');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Users size={14} /> Rural Parent Portal
        </span>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: '0.4rem 0' }}>
          👨‍👩‍👧 తల్లిదండ్రుల ప్రగతి పోర్టల్ (Parent Portal)
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          మొబైల్ నంబర్ లేదా ఇమెయిల్ ద్వారా మీ పిల్లల చదువు ప్రగతి, పరీక్ష మార్కులు మరియు హాజరు ఫలితాలను చూడవచ్చు.
        </p>
      </div>

      {/* Language Switcher for Parents */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setLang('te')}
          className={`tab-btn ${lang === 'te' ? 'active' : ''}`}
          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
        >
          తెలుగు
        </button>
        <button
          onClick={() => setLang('hi')}
          className={`tab-btn ${lang === 'hi' ? 'active' : ''}`}
          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
        >
          हिंदी
        </button>
        <button
          onClick={() => setLang('en')}
          className={`tab-btn ${lang === 'en' ? 'active' : ''}`}
          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
        >
          English
        </button>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} style={{
        background: '#ffffff',
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        border: '1px solid #a7f3d0',
        marginBottom: '2rem'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
          {lang === 'te' ? 'విద్యార్థి ఇమెయిల్ లేదా ఐడి (Student Email / ID):' : lang === 'hi' ? 'छात्र ईमेल या आईडी दर्ज करें:' : 'Enter Student Email or ID:'}
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="input-with-icon" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={18} />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. student@ruraledu.org"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            {loading ? 'Searching...' : (lang === 'te' ? 'ప్రగతి నివేదిక చూడండి' : lang === 'hi' ? 'रिपोर्ट देखें' : 'View Progress Report')}
          </button>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#64748b' }}>
          ⚡ Demo Search Suggestion: Click 
          <button 
            type="button" 
            onClick={() => { setQuery('student@ruraledu.org'); handleSearch(); }}
            style={{ border: 'none', background: 'none', color: '#059669', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginLeft: '4px' }}
          >
            student@ruraledu.org
          </button>
        </div>
      </form>

      {error && (
        <div className="auth-error-banner margin-bottom-lg">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Report Card Result */}
      {report && (
        <div className="parent-report-card" style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '2px solid #a7f3d0',
          boxShadow: '0 20px 40px -15px rgba(5, 150, 105, 0.15)'
        }}>
          {/* Header of Report */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Official Verified Progress Report
              </span>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: '0.25rem 0' }}>
                {report.studentName}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                🏫 {report.schoolName} • 🎓 {report.gradeLevel} • 📧 {report.studentEmail}
              </p>
            </div>

            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
              <Printer size={16} /> Print Report Card
            </button>
          </div>

          {/* Key Metric Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '16px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Overall Progress</span>
              <h1 style={{ fontSize: '2.5rem', color: '#059669', margin: '0.2rem 0', fontFamily: 'var(--font-heading)' }}>{report.overallProgressPercentage}%</h1>
              <span style={{ fontSize: '0.8rem', color: '#047857' }}>All Lectures Completed</span>
            </div>

            <div style={{ background: '#fff7ed', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fed7aa', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: '700', textTransform: 'uppercase' }}>Learning Streak</span>
              <h1 style={{ fontSize: '2.5rem', color: '#ea580c', margin: '0.2rem 0', fontFamily: 'var(--font-heading)' }}>🔥 {report.streakDays} Days</h1>
              <span style={{ fontSize: '0.8rem', color: '#c2410c' }}>Active Daily Study</span>
            </div>

            <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: '700', textTransform: 'uppercase' }}>Average Quiz Score</span>
              <h1 style={{ fontSize: '2.5rem', color: '#2563eb', margin: '0.2rem 0', fontFamily: 'var(--font-heading)' }}>{report.averageQuizScore} / 10</h1>
              <span style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>{report.totalQuizzesTaken} Quizzes Completed</span>
            </div>
          </div>

          {/* Encouraging Note for Parents */}
          <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '16px', borderLeft: '5px solid #059669', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={18} color="#059669" /> 
              {lang === 'te' ? 'తల్లిదండ్రులకు సందేశం:' : lang === 'hi' ? 'अभिभावकों के लिए संदेश:' : 'Message for Parents:'}
            </h4>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {lang === 'te' 
                ? `శ్రీమతి/శ్రీమాన్, మీ అమ్మాయి/అబ్బాయి (${report.studentName}) డిజిటల్ తరగతులలో 100% ఉత్తీర్ణత సాధించి చాలా చక్కగా చదువుతున్నారు. ఇంటి వద్ద కూడా రోజుకి 20 నిమిషాలు చదువుకునేలా ప్రోత్సహించండి.`
                : lang === 'hi'
                ? `आपके बच्चे (${report.studentName}) ने डिजिटल कक्षाओं में 100% प्रगति हासिल की है। घर पर भी प्रतिदिन 20 मिनट अध्ययन करने के लिए प्रोत्साहित करें।`
                : `${report.studentName} has achieved 100% progress in their online course lectures and quizzes. Encourage them to maintain their daily 5-day study streak!`}
            </p>
          </div>

          {/* Enrolled Courses Table */}
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem' }}>
            {lang === 'te' ? 'కోర్సుల ప్రగతి వివరాలు' : lang === 'hi' ? 'पाठ्यक्रम प्रगति' : 'Course Completion Breakdown'}
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                  <th style={{ padding: '10px 14px', borderRadius: '8px 0 0 8px' }}>Course Name</th>
                  <th style={{ padding: '10px 14px' }}>Completion</th>
                  <th style={{ padding: '10px 14px', borderRadius: '0 8px 8px 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.courseProgressList?.map((cp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#0f172a' }}>{cp.courseTitle}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                          <div style={{ width: `${cp.progress}%`, height: '100%', background: '#059669', borderRadius: '4px' }}></div>
                        </div>
                        <strong>{cp.progress}%</strong>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> {cp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPortalPage;
