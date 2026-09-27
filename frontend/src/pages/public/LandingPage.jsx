import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import CourseCard from '../../components/CourseCard';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, WifiOff, Globe, Award, CheckCircle, Users, GraduationCap, ArrowRight,
  Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Search, ShieldCheck,
  Heart, AlertCircle, Printer, Sprout, Cpu, Atom, MessageSquare
} from 'lucide-react';

const FLASHCARD_DECKS = [
  {
    id: 'agri',
    titleEn: 'Agriculture & Crop Science',
    titleTa: 'விவசாயம் & பயிர் அறிவியல்',
    titleTe: 'వ్యవసాయం & పైరు విజ్ఞానం',
    titleHi: 'कृषि और फसल विज्ञान',
    icon: <Sprout color="#059669" size={24} />,
    cards: [
      {
        id: 1,
        termEn: 'Photosynthesis',
        termTa: 'ஒளிச்சேர்க்கை (Photosynthesis)',
        termTe: 'కిరణజన్య సంయోగక్రియ',
        termHi: 'प्रकाश संश्लेषण',
        defEn: 'Process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.',
        defTa: 'சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடை பயன்படுத்தி தாவரங்கள் உணவு தயாரிக்கும் செயல்முறை.',
        defTe: 'సూర్యకాంతి, నీరు మరియు బొగ్గుపులుసు వాయువును ఉపయోగించి మొక్కలు ఆహారాన్ని తయారుచేసే ప్రక్రియ.',
        defHi: 'वह प्रक्रिया जिसके द्वारा हरे पौधे सूर्य के प्रकाश का उपयोग करके अपना भोजन बनाते हैं।',
        exampleEn: 'Leaves turn green due to chlorophyll which drives photosynthesis.'
      },
      {
        id: 2,
        termEn: 'Drip Irrigation',
        termTa: 'சொட்டு நீர் பாசனம் (Drip Irrigation)',
        termTe: 'బిందు సేద్యం',
        termHi: 'टपक सिंचाई (ड्रिप सिंचाई)',
        defEn: 'Water-saving irrigation technique that drips water slowly directly to the roots of plants.',
        defTa: 'தாவரங்களின் வேர்களுக்கு நேரடியாக சொட்டுச் சொட்டாக நீர் வழங்கும் நீர் சேமிப்பு பாசன முறை.',
        defTe: 'మొక్కల వేర్లకు నేరుగా బొట్లు బొట్లుగా నీటిని అందించే నీటి పొదుపు సేద్య పద్ధతి.',
        defHi: 'पौधों की जड़ों तक धीरे-धीरे पानी पहुँचाने वाली पानी की बचत करने वाली सिंचाई तकनीक।',
        exampleEn: 'Saves up to 60% of agricultural water in dry rural areas.'
      },
      {
        id: 3,
        termEn: 'Organic Farming',
        termTa: 'இயற்கை விவசாயம் (Organic Farming)',
        termTe: 'సేంద్రీయ వ్యవసాయం',
        termHi: 'जैविक खेती',
        defEn: 'Farming without synthetic chemicals or pesticides, using natural compost and neem manure.',
        defTa: 'செயற்கை இரசாயனங்கள் இல்லாமல் இயற்கை உரங்களை பயன்படுத்தி செய்யப்படும் விவசாயம்.',
        defTe: 'రసాయనాలు మరియు క్రిమిసంహారకాలు లేకుండా సహజ ఎరువులతో చేసే వ్యవసాయం.',
        defHi: 'रसायन और कीटनाशकों के बिना प्राकृतिक खाद से की जाने वाली खेती।',
        exampleEn: 'Improves long-term soil fertility and health.'
      }
    ]
  },
  {
    id: 'comp',
    titleEn: 'Digital Literacy & Computers',
    titleTa: 'டிஜிட்டல் அறிவு & கணினிகள்',
    titleTe: 'డిజిటల్ అక్షరాస్యత & కంప్యూటర్లు',
    titleHi: 'डिजिटल साक्षरता और कंप्यूटर',
    icon: <Cpu color="#2563eb" size={24} />,
    cards: [
      {
        id: 4,
        termEn: 'CPU (Central Processing Unit)',
        termTa: 'செயலி (CPU - கணினியின் மூளை)',
        termTe: 'సిపియు (కంప్యూటర్ మెదడు)',
        termHi: 'सीपीयू (कंप्यूटर का मस्तिष्क)',
        defEn: 'The primary component that executes instructions and processes data in a computer.',
        defTa: 'கணினியின் அனைத்து செயல்பாடுகளையும் தரவுகளையும் இயக்கும் முதன்மை பகுதி.',
        defTe: 'కంప్యూటర్ యొక్క అన్ని గణనలు మరియు డేటాను విశ్లేషించే ప్రధాన భాగం.',
        defHi: 'कंप्यूटर का मुख्य भाग जो सभी निर्देशों को निष्पादित करता है।',
        exampleEn: 'Known as the brain of the computer.'
      },
      {
        id: 5,
        termEn: 'Web Browser',
        termTa: 'இணைய உலாவி (Web Browser)',
        termTe: 'వెబ్ బ్రౌజర్ (Google Chrome / Edge)',
        termHi: 'वेब ब्राउजर',
        defEn: 'Software application used to access and view websites on the Internet.',
        defTa: 'இணையதளங்களை பார்வையிட பயன்படும் மென்பொருள் (உதா: Chrome, Edge).',
        defTe: 'ఇంటర్నెట్‌లో వెబ్‌సైట్‌లను చూడటానికి ఉపయోగించే సాఫ్ట్‌వేర్ యాప్.',
        defHi: 'इंटरनेट पर वेबसाइटों को देखने के लिए इस्तेमाल किया जाने वाला सॉफ्टवेयर।',
        exampleEn: 'Examples: Google Chrome, Mozilla Firefox, Microsoft Edge.'
      }
    ]
  },
  {
    id: 'science',
    titleEn: 'Class 10 Science & Physics',
    titleTa: 'பத்தாம் வகுப்பு அறிவியல் & இயற்பியல்',
    titleTe: '10వ తరగతి సైన్స్ & ఫిజిక్స్',
    titleHi: 'कक्षा 10 विज्ञान और भौतिकी',
    icon: <Atom color="#9333ea" size={24} />,
    cards: [
      {
        id: 6,
        termEn: 'Newton’s First Law of Motion',
        termTa: 'நியூட்டனின் முதல் இயக்க விதி',
        termTe: 'న్యూటన్ మొదటి గమన నియమం (జడత్వ నియమం)',
        termHi: 'न्यूटन का गति का पहला नियम (जड़त्व नियम)',
        defEn: 'An object remains at rest or in uniform motion unless acted upon by an external force.',
        defTa: 'புறவிசை செயல்படாத வரை எந்தவொரு பொருளும் தனது நிலையை மாற்றாது.',
        defTe: 'బాహ్య బలం పనిచేయనంత వరకు ప్రతి వస్తువు తన స్థిరత్వాన్ని లేదా సమగమనాన్ని కొనసాగిస్తుంది.',
        defHi: 'कोई वस्तु तब तक अपनी स्थिति नहीं बदलती जब तक उस पर कोई बाहरी बल न लगाया जाए।',
        exampleEn: 'Why passengers jerk forward when a bus suddenly stops.'
      }
    ]
  },
  {
    id: 'english',
    titleEn: 'Spoken English & Vocabulary',
    titleTa: 'ஆங்கிலப் பேச்சு & சொல்லகராதி',
    titleTe: 'స్పోకెన్ ఇంగ్లీష్ & పదజాలం',
    titleHi: 'स्पोकन इंग्लिश और शब्दावली',
    icon: <MessageSquare color="#ea580c" size={24} />,
    cards: [
      {
        id: 7,
        termEn: 'Perseverance',
        termTa: 'விடாமுயற்சி (Perseverance)',
        termTe: 'పట్టుదల / శ్రమించటం',
        termHi: 'दृढ़ता / निरंतर प्रयास',
        defEn: 'Continued effort to achieve something despite difficulties or delays.',
        defTa: 'கடினமான சூழ்நிலையிலும் இலக்கை அடையும் வரை தொடர்ந்து முயற்சி செய்தல்.',
        defTe: 'కష్టాలు ఎదురైనా లక్ష్యాన్ని సాధించే వరకు పట్టుదలతో ప్రయత్నించడం.',
        defHi: 'कठिनाइयों के बावजूद लक्ष्य हासिल करने का लगातार प्रयास।',
        exampleEn: 'With perseverance, rural students can achieve high ranks in national exams.'
      }
    ]
  }
];

const LandingPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flashcard State
  const [selectedDeckId, setSelectedDeckId] = useState('agri');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Parent Portal State
  const [parentQuery, setParentQuery] = useState('');
  const [parentReport, setParentReport] = useState(null);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState('');

  useEffect(() => {
    axiosClient.get('/public/courses')
      .then(res => setCourses(res.data.slice(0, 3)))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const activeLang = language || 'en';

  const getDeckTitle = (deck) => {
    if (activeLang === 'ta') return deck.titleTa || deck.titleEn;
    if (activeLang === 'te') return deck.titleTe || deck.titleEn;
    if (activeLang === 'hi') return deck.titleHi || deck.titleEn;
    return deck.titleEn;
  };

  const currentDeck = FLASHCARD_DECKS.find(d => d.id === selectedDeckId) || FLASHCARD_DECKS[0];
  const currentCard = currentDeck.cards[currentIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % currentDeck.cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length);
  };

  const getTerm = () => {
    if (activeLang === 'ta') return currentCard.termTa || currentCard.termEn;
    if (activeLang === 'te') return currentCard.termTe || currentCard.termEn;
    if (activeLang === 'hi') return currentCard.termHi || currentCard.termEn;
    return currentCard.termEn;
  };

  const getDef = () => {
    if (activeLang === 'ta') return currentCard.defTa || currentCard.defEn;
    if (activeLang === 'te') return currentCard.defTe || currentCard.defEn;
    if (activeLang === 'hi') return currentCard.defHi || currentCard.defEn;
    return currentCard.defEn;
  };

  const handleParentSearch = async (e) => {
    if (e) e.preventDefault();
    if (!parentQuery.trim()) return;

    setParentError('');
    setParentLoading(true);
    setParentReport(null);

    try {
      const res = await axiosClient.get(`/public/parent/student-report?query=${encodeURIComponent(parentQuery.trim())}`);
      setParentReport(res.data);
    } catch (err) {
      setParentError(err.response?.data?.message || 'No student found. Try searching for "student@ruraledu.org"');
    } finally {
      setParentLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <WifiOff size={16} /> {t('landing.heroBadge')}
          </div>
          <h1 className="hero-title">
            {t('landing.heroTitle')}
          </h1>
          <p className="hero-description">
            {t('landing.heroDescription')}
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-primary-lg">
              {t('landing.getStarted')} <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="btn-outline-lg">
              {t('landing.exploreCatalog')}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><WifiOff size={28} /></div>
          <h3>{t('landing.feature1Title')}</h3>
          <p>{t('landing.feature1Desc')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><Globe size={28} /></div>
          <h3>{t('landing.feature2Title')}</h3>
          <p>{t('landing.feature2Desc')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><GraduationCap size={28} /></div>
          <h3>{t('landing.feature3Title')}</h3>
          <p>{t('landing.feature3Desc')}</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><Award size={28} /></div>
          <h3>{t('landing.feature4Title')}</h3>
          <p>{t('landing.feature4Desc')}</p>
        </div>
      </section>

      {/* 🎴 SECTION 1: Interactive Multilingual Flashcards */}
      <section className="section-featured-courses" style={{ background: '#f8fafc', padding: '3.5rem 1.5rem', borderRadius: '24px', margin: '2rem 0' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> 
            {activeLang === 'ta' ? 'ஊடாடும் பாட நினைவூட்டல்' : activeLang === 'te' ? 'ఇంటరాక్టివ్ స్టడీ గైడ్' : activeLang === 'hi' ? 'इंटरेक्टिव अध्ययन गाइड' : 'Interactive Study Aid'}
          </span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
            🎴 
            {activeLang === 'ta' ? 'பலமொழி நினைவூட்டல் அட்டைகள் (Flashcards)' : activeLang === 'te' ? 'ఇంటరాక్టివ్ బహుభాషా ఫ్లాష్‌కార్డ్‌లు' : activeLang === 'hi' ? 'इंटरेक्टिव बहुभाषी फ़्लैशकार्ड' : 'Interactive Multilingual Flashcards'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            {activeLang === 'ta'
              ? 'விவசாயம், அறிவியல், கணினி மற்றும் ஆங்கிலப் பேச்சு பாடங்களை தமிழ், தெலுங்கு, இந்தி மற்றும் ஆங்கிலத்தில் பயிலுங்கள்!'
              : activeLang === 'te'
              ? 'వ్యవసాయం, సైన్స్, కంప్యూటర్లు మరియు ఇంగ్లీష్ పదాలను తెలుగు, తమిళం, హిందీ మరియు ఇంగ్లీషులో నేర్చుకోండి!'
              : activeLang === 'hi'
              ? 'कृषि, विज्ञान, कंप्यूटर और अंग्रेजी के प्रमुख विषयों को हिंदी, तमिल, तेलुगु और अंग्रेजी में सीखें!'
              : 'Practice key concepts in Agriculture, Science, Computers, and Spoken English in Tamil, Telugu, Hindi, and English!'}
          </p>
        </div>

        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Deck Selectors & Language Selector Sync */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            background: '#ffffff',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid #a7f3d0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {FLASHCARD_DECKS.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => { setSelectedDeckId(deck.id); setCurrentIndex(0); setIsFlipped(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    background: selectedDeckId === deck.id ? '#059669' : '#f1f5f9',
                    color: selectedDeckId === deck.id ? '#ffffff' : '#334155',
                    transition: 'all 0.2s'
                  }}
                >
                  {deck.icon} {getDeckTitle(deck)}
                </button>
              ))}
            </div>

            {/* Language Switcher synchronized with Global Navbar */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setLanguage('ta')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: activeLang === 'ta' ? '#059669' : 'transparent',
                  color: activeLang === 'ta' ? '#ffffff' : '#64748b'
                }}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('te')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: activeLang === 'te' ? '#059669' : 'transparent',
                  color: activeLang === 'te' ? '#ffffff' : '#64748b'
                }}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('hi')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: activeLang === 'hi' ? '#059669' : 'transparent',
                  color: activeLang === 'hi' ? '#ffffff' : '#64748b'
                }}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: activeLang === 'en' ? '#059669' : 'transparent',
                  color: activeLang === 'en' ? '#ffffff' : '#64748b'
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{
              minHeight: '300px',
              background: isFlipped ? '#f0fdf4' : '#ffffff',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              border: isFlipped ? '3px solid #059669' : '2px solid #e2e8f0',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.3s'
            }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: '600', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                <RotateCw size={14} /> 
                {activeLang === 'ta' ? 'திருப்ப சொடுக்கவும்' : activeLang === 'te' ? 'కార్డ్ తిప్పడానికి క్లిక్ చేయండి' : activeLang === 'hi' ? 'कार्ड पलटने के लिए क्लिक करें' : 'Click to Flip Card'}
              </div>

              <div style={{ width: '100%', margin: 'auto 0' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.75rem' }}>
                  {isFlipped 
                    ? (activeLang === 'ta' ? '💡 விளக்கம் & பொருள்' : activeLang === 'te' ? '💡 వివరణ & అర్థం' : activeLang === 'hi' ? '💡 व्याख्या और अर्थ' : '💡 Explanation & Meaning') 
                    : (activeLang === 'ta' ? '❓ கருத்து / கேள்வி' : activeLang === 'te' ? '❓ ప్రశ్న / పదం' : activeLang === 'hi' ? '❓ प्रश्न / अवधारणा' : '❓ Question / Concept')}
                </span>

                {!isFlipped ? (
                  <div>
                    <h2 style={{ fontSize: '2.4rem', color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem 0' }}>
                      {getTerm()}
                    </h2>
                    {activeLang !== 'en' && (
                      <span style={{ fontSize: '1.1rem', color: '#64748b', fontStyle: 'italic' }}>({currentCard.termEn})</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '1.3rem', color: '#0f172a', lineHeight: 1.5, fontWeight: '500', marginBottom: '1.25rem' }}>
                      {getDef()}
                    </p>
                    <div style={{ background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'inline-block', textAlign: 'left' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#059669', display: 'block' }}>
                        📌 {activeLang === 'ta' ? 'உதாரணம்:' : activeLang === 'te' ? 'ఉదాహరణ:' : activeLang === 'hi' ? 'उदाहरण:' : 'Example:'}
                      </strong>
                      <span style={{ fontSize: '0.92rem', color: '#334155' }}>"{currentCard.exampleEn}"</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                  Card {currentIndex + 1} of {currentDeck.cards.length}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '600' }}>
                  {activeLang === 'ta' ? 'திருப்ப சொடுக்கவும் 🔄' : activeLang === 'te' ? 'కార్డ్ తిప్పడానికి క్లిక్ చేయండి 🔄' : activeLang === 'hi' ? 'कार्ड पलटने के लिए क्लिक करें 🔄' : 'Click card to flip 🔄'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handlePrevCard} className="btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <ChevronLeft size={18} /> {activeLang === 'ta' ? 'முந்தைய அட்டை' : activeLang === 'te' ? 'మునుపటి కార్డ్' : activeLang === 'hi' ? 'पिछला कार्ड' : 'Previous Card'}
            </button>
            <button onClick={handleNextCard} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              {activeLang === 'ta' ? 'அடுத்த அட்டை' : activeLang === 'te' ? 'తదుపరి కార్డ్' : activeLang === 'hi' ? 'अगला कार्ड' : 'Next Card'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 👨‍👩‍👧 SECTION 2: Parent Progress Summary Portal */}
      <section className="section-featured-courses" style={{ background: '#ffffff', padding: '3.5rem 1.5rem', borderRadius: '24px', border: '2px solid #a7f3d0', margin: '2rem 0' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} /> {activeLang === 'ta' ? 'பெற்றோர் தளம்' : activeLang === 'te' ? 'తల్లిదండ్రుల పోర్టల్' : activeLang === 'hi' ? 'अभिभावक पोर्टल' : 'Parent Portal'}
          </span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
            👨‍👩‍👧 
            {activeLang === 'ta' ? 'பெற்றோர் கல்வி வளர்ச்சி தளம்' : activeLang === 'te' ? 'తల్లిదండ్రుల ప్రగతి పోర్టల్' : activeLang === 'hi' ? 'अभिभावक प्रगति पोर्टल' : 'Parent Progress Portal'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            {activeLang === 'ta'
              ? 'மின்னஞ்சல் அல்லது ஐடி உள்ளிட்டு உங்கள் குழந்தையின் கல்வி நிலையை அறியலாம்.'
              : activeLang === 'te'
              ? 'ఇమెయిల్ లేదా ఐడి ఎంటర్ చేసి మీ పిల్లల చదువు ప్రగతి మరియు పరీక్ష మార్కులను చూడవచ్చు.'
              : activeLang === 'hi'
              ? 'ईमेल या आईडी दर्ज करके अपने बच्चे की अध्ययन प्रगति और परीक्षा अंक देखें।'
              : 'Enter student email or ID to view course progress and quiz marks.'}
          </p>
        </div>

        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Language Selector for Parent Portal Sync */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setLanguage('ta')}
              className={`tab-btn ${activeLang === 'ta' ? 'active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`tab-btn ${activeLang === 'te' ? 'active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`tab-btn ${activeLang === 'hi' ? 'active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`tab-btn ${activeLang === 'en' ? 'active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              English
            </button>
          </div>

          <form onSubmit={handleParentSearch} style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem'
          }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
              {activeLang === 'ta' ? 'மாணவர் மின்னஞ்சல் (Student Email):' : activeLang === 'te' ? 'విద్యార్థి ఇమెయిల్ (Student Email):' : activeLang === 'hi' ? 'छात्र ईमेल दर्ज करें:' : 'Enter Student Email:'}
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="input-with-icon" style={{ flex: 1, minWidth: '250px' }}>
                <Search size={18} />
                <input
                  type="text"
                  required
                  value={parentQuery}
                  onChange={(e) => setParentQuery(e.target.value)}
                  placeholder="student@ruraledu.org"
                />
              </div>
              <button type="submit" disabled={parentLoading} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                {parentLoading ? 'Searching...' : (activeLang === 'ta' ? 'அறிக்கையைப் பார்க்கவும்' : activeLang === 'te' ? 'ప్రగతి నివేదిక చూడండి' : activeLang === 'hi' ? 'रिपोर्ट देखें' : 'View Report')}
              </button>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#64748b' }}>
              ⚡ Demo Search: Click 
              <button 
                type="button" 
                onClick={() => { setParentQuery('student@ruraledu.org'); handleParentSearch(); }}
                style={{ border: 'none', background: 'none', color: '#059669', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginLeft: '4px' }}
              >
                student@ruraledu.org
              </button>
            </div>
          </form>

          {parentError && (
            <div className="auth-error-banner margin-bottom-lg">
              <AlertCircle size={18} /> {parentError}
            </div>
          )}

          {parentReport && (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #059669',
              boxShadow: '0 15px 30px -10px rgba(5, 150, 105, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> Verified Student Report
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: '#0f172a', margin: '0.25rem 0' }}>{parentReport.studentName}</h3>
                  <span style={{ color: '#64748b', fontSize: '0.88rem' }}>🏫 {parentReport.schoolName} • 🎓 {parentReport.gradeLevel}</span>
                </div>

                <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Printer size={16} /> Print Report
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700' }}>PROGRESS</span>
                  <h2 style={{ fontSize: '2rem', color: '#059669', margin: '0.1rem 0' }}>{parentReport.overallProgressPercentage}%</h2>
                  <span style={{ fontSize: '0.75rem', color: '#047857' }}>Completed</span>
                </div>

                <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid #fed7aa' }}>
                  <span style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: '700' }}>STREAK</span>
                  <h2 style={{ fontSize: '2rem', color: '#ea580c', margin: '0.1rem 0' }}>🔥 {parentReport.streakDays} Days</h2>
                  <span style={{ fontSize: '0.75rem', color: '#c2410c' }}>Active Learning</span>
                </div>

                <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: '700' }}>QUIZ AVERAGE</span>
                  <h2 style={{ fontSize: '2rem', color: '#2563eb', margin: '0.1rem 0' }}>{parentReport.averageQuizScore} / 10</h2>
                  <span style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>Passed</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '4px solid #059669' }}>
                <strong style={{ color: '#059669', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={16} /> 
                  {activeLang === 'ta' ? 'பெற்றோருக்கான செய்தி:' : activeLang === 'te' ? 'తల్లిదండ్రులకు సందేశం:' : activeLang === 'hi' ? 'अभिभावकों के लिए संदेश:' : 'Note for Parents:'}
                </strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontSize: '0.9rem' }}>
                  {activeLang === 'ta'
                    ? `வணக்கம், உங்கள் குழந்தை (${parentReport.studentName}) இணையவழி வகுப்புகளில் 100% தேர்ச்சி பெற்று சிறப்பாக படிக்கிறார். வீட்டிலும் தினமும் 20 நிமிடங்கள் படிக்க ஊக்குவிக்கவும்.`
                    : activeLang === 'te' 
                    ? `శ్రీమతి/శ్రీమాన్, మీ అమ్మాయి/అబ్బాయి (${parentReport.studentName}) డిజిటల్ తరగతులలో 100% ఉత్తీర్ణత సాధించి చాలా చక్కగా చదువుతున్నారు.`
                    : activeLang === 'hi'
                    ? `आपके बच्चे (${parentReport.studentName}) ने डिजिटल कक्षाओं में 100% प्रगति हासिल की है।`
                    : `${parentReport.studentName} has achieved 100% progress in their online course lectures and quizzes.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-featured-courses">
        <div className="section-header">
          <h2>{t('landing.featuredTitle')}</h2>
          <p>{t('landing.featuredDesc')}</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading courses...</div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
