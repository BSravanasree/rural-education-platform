import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, 
  Volume2, BookOpen, Cpu, Sprout, Atom, MessageSquare, Layers, Award 
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
      },
      {
        id: 4,
        termEn: 'NPK Fertilizers',
        termTa: 'NPK உரங்கள் (நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம்)',
        termTe: 'NPK ఎరువులు (నత్రజని, భాస్వరం, పొటాషియం)',
        termHi: 'एनपीके उर्वरक (नाइट्रोजन, फास्फोरस, पोटेशियम)',
        defEn: 'Essential plant nutrients: Nitrogen (growth), Phosphorus (roots), Potassium (disease resistance).',
        defTa: 'தாவர வளர்ச்சிக்கு தேவையான மூன்று முக்கிய சத்துக்கள்: நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம்.',
        defTe: 'మొక్కల పెరుగుదలకు కావలసిన మూడు ప్రధాన పోషకాలు: నైట్రోజన్, భాస్వరం, పొటాషియం.',
        defHi: 'पौधों के विकास के लिए तीन मुख्य पोषक तत्व।',
        exampleEn: 'Balanced NPK ratio boosts crop productivity.'
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
        id: 5,
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
        id: 6,
        termEn: 'Web Browser',
        termTa: 'இணைய உலாவி (Web Browser)',
        termTe: 'వెబ్ బ్రౌజర్ (Google Chrome / Edge)',
        termHi: 'वेब ब्राउजर',
        defEn: 'Software application used to access and view websites on the Internet.',
        defTa: 'இணையதளங்களை பார்வையிட பயன்படும் மென்பொருள் (உதா: Chrome, Edge).',
        defTe: 'ఇంటర్నెట్‌లో వెబ్‌సైట్‌లను చూడటానికి ఉపయోగించే సాఫ్ట్‌వేర్ యాప్.',
        defHi: 'इंटरनेट पर वेबसाइटों को देखने के लिए इस्तेमाल किया जाने वाला सॉफ्टवेयर।',
        exampleEn: 'Examples: Google Chrome, Mozilla Firefox, Microsoft Edge.'
      },
      {
        id: 7,
        termEn: 'Cyber Hygiene & Security',
        termTa: 'இணைய பாதுகாப்பு (Cyber Security)',
        termTe: 'సైబర్ భద్రత & పాస్‌వర్డ్ జాగ్రత్తలు',
        termHi: '사이बर सुरक्षा',
        defEn: 'Practices for maintaining online safety, protecting OTPs, and securing passwords.',
        defTa: 'கடவுச்சொல் மற்றும் OTP விவரங்களை பாதுகாப்பாக வைத்துக்கொள்ளும் வழிமுறைகள்.',
        defTe: 'ఇంటర్నెట్ వినియోగంలో పాస్‌వర్డ్‌లు, OTP లను సురక్షితంగా ఉంచుకునే భద్రతా నియమాలు.',
        defHi: 'ऑनलाइन सुरक्षा और पासवर्ड को सुरक्षित रखने के नियम।',
        exampleEn: 'Never share your Banking OTP with anyone.'
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
        id: 8,
        termEn: 'Newton’s First Law of Motion',
        termTa: 'நியூட்டனின் முதல் இயக்க விதி',
        termTe: 'న్యూటన్ మొదటి గమన నియమం (జడత్వ నియమం)',
        termHi: 'न्यूटन का गति का पहला नियम (जड़त्व नियम)',
        defEn: 'An object remains at rest or in uniform motion unless acted upon by an external force.',
        defTa: 'புறவிசை செயல்படாத வரை எந்தவொரு பொருளும் தனது நிலையை மாற்றாது.',
        defTe: 'బాహ్య బలం పనిచేయనంత వరకు ప్రతి వస్తువు తన స్థిరత్వాన్ని లేదా సమగమనాన్ని కొనసాగిస్తుంది.',
        defHi: 'कोई वस्तु तब तक अपनी स्थिति नहीं बदलती जब तक उस पर कोई बाहरी बल न लगाया जाए।',
        exampleEn: 'Why passengers jerk forward when a bus suddenly stops.'
      },
      {
        id: 9,
        termEn: 'Ohm’s Law (V = IR)',
        termTa: 'ஓமின் விதி (V = IR)',
        termTe: 'ఓమ్ నియమం (V = IR)',
        termHi: 'ओम का नियम (V = IR)',
        defEn: 'Electric current is directly proportional to voltage and inversely proportional to resistance.',
        defTa: 'மின்னோட்டம் (I) மின்னழுத்தத்திற்கு (V) நேர் விகிதத்தில் இருக்கும்.',
        defTe: 'విద్యుత్ ప్రవాహం (I) వోల్టేజ్ (V) కి నేరుగా అనులోమానుపాతంలో ఉంటుంది.',
        defHi: 'विद्युत धारा (I) वोल्टेज (V) के समानुपाती होती है।',
        exampleEn: 'Used to design electrical circuits and solar battery systems.'
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
        id: 10,
        termEn: 'Perseverance',
        termTa: 'விடாமுயற்சி (Perseverance)',
        termTe: 'పట్టుదల / శ్రమించటం',
        termHi: 'दृढ़ता / निरंतर प्रयास',
        defEn: 'Continued effort to achieve something despite difficulties or delays.',
        defTa: 'கடினமான சூழ்நிலையிலும் இலக்கை அடையும் வரை தொடர்ந்து முயற்சி செய்தல்.',
        defTe: 'కష్టాలు ఎదురైనా లక్ష్యాన్ని సాధించే వరకు పట్టుదలతో ప్రయత్నించడం.',
        defHi: 'कठिनाइयों के बावजूद लक्ष्य हासिल करने का लगातार प्रयास।',
        exampleEn: 'With perseverance, rural students can achieve high ranks in national exams.'
      },
      {
        id: 11,
        termEn: 'Collaboration',
        termTa: 'கூட்டுப் பணி (Collaboration)',
        termTe: 'సహకారం / కలిసి పనిచేయడం',
        termHi: 'सहयोग',
        defEn: 'Working together with others to create or produce something.',
        defTa: 'ஒரு இலக்கை அடைய அனைவரும் இணைந்து செயல்படுதல்.',
        defTe: 'ఒక లక్ష్యం కోసం అందరూ కలిసికట్టుగా పనిచేయడం.',
        defHi: 'एक साथ मिलकर काम करना।',
        exampleEn: 'Group study promotes peer collaboration.'
      }
    ]
  }
];

const FlashcardsPage = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedDeckId, setSelectedDeckId] = useState('agri');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});

  const activeLang = language || 'en';

  const getDeckTitle = (deck) => {
    if (activeLang === 'ta') return deck.titleTa || deck.titleEn;
    if (activeLang === 'te') return deck.titleTe || deck.titleEn;
    if (activeLang === 'hi') return deck.titleHi || deck.titleEn;
    return deck.titleEn;
  };

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

  return (
    <div className="main-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-green margin-bottom-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> 
          {activeLang === 'ta' ? 'ஊடாடும் பாட நினைவூட்டல்' : activeLang === 'te' ? 'ఇంటరాక్టివ్ స్టడీ గైడ్' : activeLang === 'hi' ? 'इंटरेक्टिव अध्ययन गाइड' : 'Interactive Study Aid'}
        </span>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: '0.4rem 0' }}>
          🎴 
          {activeLang === 'ta' ? 'பலமொழி நினைவூட்டல் அட்டைகள் (Flashcards)' : activeLang === 'te' ? 'ఇంటరాక్టివ్ బహుభాషా ఫ్లాష్‌కార్డ్‌లు' : activeLang === 'hi' ? 'इंटरेक्टिव बहुभाषी फ़्लैशकार्ड' : 'Interactive Multilingual Flashcards'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          {activeLang === 'ta'
            ? 'விவசாயம், அறிவியல், கணினி மற்றும் ஆங்கிலப் பேச்சு பாடங்களை தமிழ், தெலுங்கு, இந்தி மற்றும் ஆங்கிலத்தில் பயிலுங்கள்!'
            : activeLang === 'te'
            ? 'వ్యవసాయం, సైన్స్, కంప్యూటర్లు మరియు ఇంగ్లీష్ పదాలను తెలుగు, తమిళం, హిందీ మరియు ఇంగ్లీషులో నేర్చుకోండి!'
            : activeLang === 'hi'
            ? 'कृषि, विज्ञान, कंप्यूटर और अंग्रेजी के प्रमुख विषयों को हिंदी, तमिल, तेलुगु और अंग्रेजी में सीखें!'
            : 'Master key concepts in Agriculture, Science, Computers, and Spoken English in Tamil, Telugu, Hindi, and English!'}
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
              {deck.icon} {getDeckTitle(deck)}
            </button>
          ))}
        </div>

        {/* Language Switcher Buttons Synchronized */}
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
                <p style={{ fontSize: '1.35rem', color: '#0f172a', lineHeight: 1.5, fontWeight: '500', marginBottom: '1.25rem' }}>
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
              <CheckCircle2 size={16} /> {masteredCards[currentCard.id] ? (activeLang === 'ta' ? 'முடிந்தது! 🎉' : 'Mastered! 🎉') : (activeLang === 'ta' ? 'முடிந்தது என குறிக்க' : 'Mark as Mastered')}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePrev} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={20} /> {activeLang === 'ta' ? 'முந்தைய அட்டை' : activeLang === 'te' ? 'మునుపటి కార్డ్' : activeLang === 'hi' ? 'पिछला कार्ड' : 'Previous Card'}
        </button>

        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
          {activeLang === 'ta' ? 'திருப்ப அட்டையை சொடுக்கவும்' : activeLang === 'te' ? 'కార్డ్ తిప్పడానికి క్లిక్ చేయండి' : activeLang === 'hi' ? 'कार्ड पलटने के लिए क्लिक करें' : 'Press card to flip'}
        </span>

        <button onClick={handleNext} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeLang === 'ta' ? 'அடுத்த அட்டை' : activeLang === 'te' ? 'తదుపరి కార్డ్' : activeLang === 'hi' ? 'अगला कार्ड' : 'Next Card'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
