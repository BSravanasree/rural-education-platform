import React, { useState } from 'react';
import { 
  Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, 
  Volume2, BookOpen, Cpu, Sprout, Atom, MessageSquare, Layers, Award 
} from 'lucide-react';

const FLASHCARD_DECKS = [
  {
    id: 'agri',
    title: 'Agriculture & Crop Science',
    icon: <Sprout color="#059669" size={24} />,
    cards: [
      {
        id: 1,
        termEn: 'Photosynthesis',
        termTe: 'కిరణజన్య సంయోగక్రియ',
        termHi: 'प्रकाश संश्लेषण',
        defEn: 'Process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.',
        defTe: 'సూర్యకాంతి, నీరు మరియు బొగ్గుపులుసు వాయువును ఉపయోగించి మొక్కలు ఆహారాన్ని తయారుచేసే ప్రక్రియ.',
        defHi: 'वह प्रक्रिया जिसके द्वारा हरे पौधे सूर्य के प्रकाश का उपयोग करके अपना भोजन बनाते हैं।',
        exampleEn: 'Leaves turn green due to chlorophyll which drives photosynthesis.'
      },
      {
        id: 2,
        termEn: 'Drip Irrigation',
        termTe: 'బిందు సేద్యం',
        termHi: 'टपक सिंचाई (ड्रिप सिंचाई)',
        defEn: 'Water-saving irrigation technique that drips water slowly directly to the roots of plants.',
        defTe: 'మొక్కల వేర్లకు నేరుగా బొట్లు బొట్లుగా నీటిని అందించే నీటి పొదుపు సేద్య పద్ధతి.',
        defHi: 'पौधों की जड़ों तक धीरे-धीरे पानी पहुँचाने वाली पानी की बचत करने वाली सिंचाई तकनीक।',
        exampleEn: 'Saves up to 60% of agricultural water in dry rural areas.'
      },
      {
        id: 3,
        termEn: 'Organic Farming',
        termTe: 'సేంద్రీయ వ్యవసాయం',
        termHi: 'जैविक खेती',
        defEn: 'Farming without synthetic chemicals or pesticides, using natural compost and neem manure.',
        defTe: 'రసాయనాలు మరియు క్రిమిసంహారకాలు లేకుండా సహజ ఎరువులతో చేసే వ్యవసాయం.',
        defHi: 'रसायन और कीटनाशकों के बिना प्राकृतिक खाद से की जाने वाली खेती।',
        exampleEn: 'Improves long-term soil fertility and health.'
      },
      {
        id: 4,
        termEn: 'NPK Fertilizers',
        termTe: 'NPK ఎరువులు (నత్రజని, భాస్వరం, పొటాషియం)',
        termHi: 'एनपीके उर्वरक (नाइट्रोजन, फास्फोरस, पोटेशियम)',
        defEn: 'Essential plant nutrients: Nitrogen (growth), Phosphorus (roots), Potassium (disease resistance).',
        defTe: 'మొక్కల పెరుగుదలకు కావలసిన మూడు ప్రధాన పోషకాలు: నైట్రోజన్, భాస్వరం, పొటాషియం.',
        defHi: 'पौधों के विकास के लिए तीन मुख्य पोषक तत्व।',
        exampleEn: 'Balanced NPK ratio boosts crop productivity.'
      }
    ]
  },
  {
    id: 'comp',
    title: 'Digital Literacy & Computers',
    icon: <Cpu color="#2563eb" size={24} />,
    cards: [
      {
        id: 5,
        termEn: 'CPU (Central Processing Unit)',
        termTe: 'సిపియు (కంప్యూటర్ మెదడు)',
        termHi: 'सीपीयू (कंप्यूटर का मस्तिष्क)',
        defEn: 'The primary component that executes instructions and processes data in a computer.',
        defTe: 'కంప్యూటర్ యొక్క అన్ని గణనలు మరియు డేటాను విశ్లేషించే ప్రధాన భాగం.',
        defHi: 'कंप्यूटर का मुख्य भाग जो सभी निर्देशों को निष्पादित करता है।',
        exampleEn: 'Known as the brain of the computer.'
      },
      {
        id: 6,
        termEn: 'Web Browser',
        termTe: 'వెబ్ బ్రౌజర్ (Google Chrome / Edge)',
        termHi: 'वेब ब्राउजर',
        defEn: 'Software application used to access and view websites on the Internet.',
        defTe: 'ఇంటర్నెట్‌లో వెబ్‌సైట్‌లను చూడటానికి ఉపయోగించే సాఫ్ట్‌వేర్ యాప్.',
        defHi: 'इंटरनेट पर वेबसाइटों को देखने के लिए इस्तेमाल किया जाने वाला सॉफ्टवेयर।',
        exampleEn: 'Examples: Google Chrome, Mozilla Firefox, Microsoft Edge.'
      },
      {
        id: 7,
        termEn: 'Cyber Hygiene & Security',
        termTe: 'సైబర్ భద్రత & పాస్‌వర్డ్ జాగ్రత్తలు',
        termHi: 'साइबर सुरक्षा',
        defEn: 'Practices for maintaining online safety, protecting OTPs, and securing passwords.',
        defTe: 'ఇంటర్నెట్ వినియోగంలో పాస్‌వర్డ్‌లు, OTP లను సురక్షితంగా ఉంచుకునే భద్రతా నియమాలు.',
        defHi: 'ऑनलाइन सुरक्षा और पासवर्ड को सुरक्षित रखने के नियम।',
        exampleEn: 'Never share your Banking OTP with anyone.'
      }
    ]
  },
  {
    id: 'science',
    title: 'Class 10 Science & Physics',
    icon: <Atom color="#9333ea" size={24} />,
    cards: [
      {
        id: 8,
        termEn: 'Newton’s First Law of Motion',
        termTe: 'న్యూటన్ మొదటి గమన నియమం (జడత్వ నియమం)',
        termHi: 'न्यूटन का गति का पहला नियम (जड़त्व नियम)',
        defEn: 'An object remains at rest or in uniform motion unless acted upon by an external force.',
        defTe: 'బాహ్య బలం పనిచేయనంత వరకు ప్రతి వస్తువు తన స్థిరత్వాన్ని లేదా సమగమనాన్ని కొనసాగిస్తుంది.',
        defHi: 'कोई वस्तु तब तक अपनी स्थिति नहीं बदलती जब तक उस पर कोई बाहरी बल न लगाया जाए।',
        exampleEn: 'Why passengers jerk forward when a bus suddenly stops.'
      },
      {
        id: 9,
        termEn: 'Ohm’s Law (V = IR)',
        termTe: 'ఓమ్ నియమం (V = IR)',
        termHi: 'ओम का नियम (V = IR)',
        defEn: 'Electric current is directly proportional to voltage and inversely proportional to resistance.',
        defTe: 'విద్యుత్ ప్రవాహం (I) వోల్టేజ్ (V) కి నేరుగా అనులోమానుపాతంలో ఉంటుంది.',
        defHi: 'विद्युत धारा (I) वोल्टेज (V) के समानुपाती होती है।',
        exampleEn: 'Used to design electrical circuits and solar battery systems.'
      }
    ]
  },
  {
    id: 'english',
    title: 'Spoken English & Vocabulary',
    icon: <MessageSquare color="#ea580c" size={24} />,
    cards: [
      {
        id: 10,
        termEn: 'Perseverance',
        termTe: 'పట్టుదల / శ్రమించటం',
        termHi: 'दृढ़ता / निरंतर प्रयास',
        defEn: 'Continued effort to achieve something despite difficulties or delays.',
        defTe: 'కష్టాలు ఎదురైనా లక్ష్యాన్ని సాధించే వరకు పట్టుదలతో ప్రయత్నించడం.',
        defHi: 'कठिनाइयों के बावजूद लक्ष्य हासिल करने का लगातार प्रयास।',
        exampleEn: 'With perseverance, rural students can achieve high ranks in national exams.'
      },
      {
        id: 11,
        termEn: 'Collaboration',
        termTe: 'సహకారం / కలిసి పనిచేయడం',
        termHi: 'सहयोग',
        defEn: 'Working together with others to create or produce something.',
        defTe: 'ఒక లక్ష్యం కోసం అందరూ కలిసికట్టుగా పనిచేయడం.',
        defHi: 'एक साथ मिलकर काम करना।',
        exampleEn: 'Group study promotes peer collaboration.'
      }
    ]
  }
];

const FlashcardsPage = () => {
  const [selectedDeckId, setSelectedDeckId] = useState('agri');
  const [lang, setLang] = useState('te'); // 'te', 'hi', 'en'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});

  const currentDeck = FLASHCARD_DECKS.find(d => d.id === selectedDeckId) || FLASHCARD_DECKS[0];
  const currentCard = currentDeck.cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % currentDeck.cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + currentDeck.cards.length) % currentDeck.cards.length);
  };

  const toggleMastered = (cardId) => {
    setMasteredCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getTerm = () => {
    if (lang === 'te') return currentCard.termTe;
    if (lang === 'hi') return currentCard.termHi;
    return currentCard.termEn;
  };

  const getDef = () => {
    if (lang === 'te') return currentCard.defTe;
    if (lang === 'hi') return currentCard.defHi;
    return currentCard.defEn;
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> Interactive Study Aid
        </span>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: '0.4rem 0' }}>
          🎴 Multilingual Flashcards
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Master key concepts in Agriculture, Science, Computers, and Spoken English in Telugu, Hindi, and English!
        </p>
      </div>

      {/* Language & Subject Deck Selectors */}
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
              {deck.icon} {deck.title}
            </button>
          ))}
        </div>

        {/* Language Switcher Buttons */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setLang('te')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: lang === 'te' ? '#059669' : 'transparent',
              color: lang === 'te' ? '#ffffff' : '#64748b'
            }}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setLang('hi')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: lang === 'hi' ? '#059669' : 'transparent',
              color: lang === 'hi' ? '#ffffff' : '#64748b'
            }}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: lang === 'en' ? '#059669' : 'transparent',
              color: lang === 'en' ? '#ffffff' : '#64748b'
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* Flashcard Component */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: '1000px',
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{
          minHeight: '320px',
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Flip Hint Top Corner */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: '600', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
            <RotateCw size={14} /> Click to Flip Card
          </div>

          <div style={{ width: '100%', margin: 'auto 0' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.75rem' }}>
              {isFlipped ? '💡 Explanation & Meaning (వివరణ)' : '❓ Question / Concept (ప్రశ్న / పదం)'}
            </span>

            {!isFlipped ? (
              <div>
                <h2 style={{ fontSize: '2.4rem', color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem 0' }}>
                  {getTerm()}
                </h2>
                {lang !== 'en' && (
                  <span style={{ fontSize: '1.1rem', color: '#64748b', fontStyle: 'italic' }}>({currentCard.termEn})</span>
                )}
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '1.35rem', color: '#0f172a', lineHeight: 1.5, fontWeight: '500', marginBottom: '1.25rem' }}>
                  {getDef()}
                </p>
                <div style={{ background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'inline-block', textAlign: 'left' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#059669', display: 'block' }}>📌 Real-world Example:</strong>
                  <span style={{ fontSize: '0.92rem', color: '#334155' }}>"{currentCard.exampleEn}"</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Card */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Card {currentIndex + 1} of {currentDeck.cards.length}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); toggleMastered(currentCard.id); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: masteredCards[currentCard.id] ? '#dcfce7' : '#f1f5f9',
                color: masteredCards[currentCard.id] ? '#15803d' : '#64748b'
              }}
            >
              <CheckCircle2 size={16} /> {masteredCards[currentCard.id] ? 'Mastered! 🎉' : 'Mark as Mastered'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePrev} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={20} /> Previous Card
        </button>

        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Press card to flip • Use arrows to navigate
        </span>

        <button onClick={handleNext} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Next Card <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
