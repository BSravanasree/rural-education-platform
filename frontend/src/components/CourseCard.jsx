import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { BookOpen, Globe, User, Zap } from 'lucide-react';

const COURSE_TRANSLATIONS = {
  'Basic Mathematics for Rural High Schools': {
    ta: 'கிராமப்புற உயர்நிலைப் பள்ளிகளுக்கான அடிப்படை கணிதம்',
    te: 'గ్రామీణ ఉన్నత పాఠశాలల ప్రాథమిక గణితం',
    hi: 'ग्रामीण उच्च विद्यालयों के लिए बुनियादी गणित',
    en: 'Basic Mathematics for Rural High Schools'
  },
  'Introduction to Agriculture & Plant Science': {
    ta: 'விவசாயம் & பயிர் அறிவியல் அறிமுகம்',
    te: 'వ్యవసాయం & పైరు విజ్ఞాన శాస్త్ర పరిచయం',
    hi: 'कृषि और फसल विज्ञान परिचय',
    en: 'Introduction to Agriculture & Plant Science'
  },
  'Digital Literacy & Basic Computers': {
    ta: 'டிஜிட்டல் அறிவு & அடிப்படை கணினிகள்',
    te: 'డిజిటల్ అక్షరాస్యత & ప్రాథమిక కంప్యూటర్లు',
    hi: 'डिजिटल साक्षरता और बुनियादी कंप्यूटर',
    en: 'Digital Literacy & Basic Computers'
  },
  'Class 10 General Science & Physics Foundations': {
    ta: 'பத்தாம் வகுப்பு பொது அறிவியல் & இயற்பியல்',
    te: '10వ తరగతి జనరల్ సైన్స్ & ఫిజిక్స్ పునాదులు',
    hi: 'कक्षा 10 सामान्य विज्ञान और भौतिकी',
    en: 'Class 10 General Science & Physics Foundations'
  },
  'Spoken English & Communication Skills for Rural Youth': {
    ta: 'கிராமப்புற இளைஞர்களுக்கான ஆங்கிலப் பேச்சு & தொடர்பாடல்',
    te: 'గ్రామీణ యువతకు స్పోకెన్ ఇంగ్లీష్ & కమ్యూనికేషన్ స్కిల్స్',
    hi: 'ग्रामीण युवाओं के लिए स्पोकन इंग्लिश और संचार कौशल',
    en: 'Spoken English & Communication Skills for Rural Youth'
  },
  'Vocational Skills & Local Handicrafts': {
    ta: 'தொழில் திறன் & கைவினைப் பொருட்கள்',
    te: 'వృత్తి నైపుణ్యాలు & హస్తకళలు',
    hi: 'व्यावसायिक कौशल और स्थानीय हस्तशिल्प',
    en: 'Vocational Skills & Local Handicrafts'
  }
};

const DESCRIPTION_TRANSLATIONS = {
  'Basic Mathematics for Rural High Schools': {
    ta: 'அல்ஜீப்ரா, வடிவியல், கணிதம் மற்றும் நிஜ உலக கணித பயன்பாடுகளை உள்ளடக்கிய விரிவான பாடம்.',
    te: 'బీజగణితం, రేఖాఖండాలు, అంకగణితం మరియు రోజువారీ గణిత సూత్రాల వివరణ.',
    hi: 'बीजगणित, ज्यामिति और व्यावहारिक गणित अनुप्रयोगों को कवर करने वाला विस्तृत पाठ्यक्रम।',
    en: 'Comprehensive guide covering Algebra, Geometry, Arithmetic, and real-world math applications.'
  },
  'Introduction to Agriculture & Plant Science': {
    ta: 'நவீன விவசாய நுட்பங்கள், மண் வளம், பயிர் பாதுகாப்பு மற்றும் நிலையான விவசாய அறிவியல்.',
    te: 'ఆధునిక సేద్య పద్ధతులు, నేల ఆరోగ్యం, పైరు రక్షణ మరియు సేంద్రీయ వ్యవసాయం.',
    hi: 'आधुनिक कृषि तकनीक, मृदा स्वास्थ्य और फसल सुरक्षा सीखें।',
    en: 'Learn modern farming techniques, soil health management, crop protection, and sustainable agricultural science.'
  },
  'Digital Literacy & Basic Computers': {
    ta: 'கணினி அடிப்படைகள், இணைய உலாவுதல், இணைய பாதுகாப்பு மற்றும் டிஜிட்டல் பரிவர்த்தனைகள்.',
    te: 'కంప్యూటర్ ప్రాథమిక అంశాలు, ఇంటర్నెట్ సెర్చ్, సైబర్ భద్రత మరియు డిజిటల్ చెల్లింపులు.',
    hi: 'कंप्यूटर की बुनियादी बातें, इंटरनेट ब्राउज़िंग और डिजिटल सुरक्षा सीखें।',
    en: 'Master computer basics, internet browsing, cyber safety, digital payments, and essential Office applications.'
  },
  'Class 10 General Science & Physics Foundations': {
    ta: 'பத்தாம் வகுப்பு தேர்வுக்கான இயற்பியல் விதிகள், நியூட்டனின் இயக்க விதிகள், ஒளி மற்றும் மின்சாரம்.',
    te: '10వ తరగతి పరీక్షల కోసం భౌతిక శాస్త్ర సూత్రాలు, న్యూటన్ నియమాలు, కాంతి మరియు విద్యుత్.',
    hi: 'कक्षा 10 बोर्ड परीक्षाओं के लिए भौतिकी के मूल सिद्धांत, न्यूटन के नियम और बिजली।',
    en: 'Fundamental physics principles, Newton\'s laws, light reflection, optics, and electricity for Class 10 board exams.'
  },
  'Spoken English & Communication Skills for Rural Youth': {
    ta: 'ஆங்கிலச் சொற்களஞ்சியம், வாக்கிய உருவாக்கம் மற்றும் தினசரி உரையாடல் திறனை மேம்படுத்துங்கள்.',
    te: 'ఇంగ్లీష్ పదజాలం, వాక్య నిర్మాణం మరియు రోజువారీ సంభాషణ నైపుణ్యాలు పెంచుకోండి.',
    hi: 'शब्दावली, वाक्य निर्माण और दैनिक बातचीत में सुधार करें।',
    en: 'Improve vocabulary, sentence construction, daily conversation, and public speaking confidence.'
  },
  'Vocational Skills & Local Handicrafts': {
    ta: 'தொழில்சார் பயிற்சி, கைவினைப் பொருட்கள் தயாரிப்பு மற்றும் கிராமப்புற தொழில் முனைவோர் வழிகாட்டி.',
    te: 'హస్తకళల తయారీ, చిన్న తరహా పరిశ్రమలు మరియు స్వయం ఉపాధి నైపుణ్యాలు.',
    hi: 'व्यावहारिक व्यावसायिक कौशल प्रशिक्षण और ग्रामीण उद्यमिता।',
    en: 'Practical vocational skills training, handicraft making, small business setup, and rural entrepreneurship.'
  }
};

const CATEGORY_TRANSLATIONS = {
  'MATHEMATICS': { ta: 'கணிதம்', te: 'గణితం', hi: 'गणित', en: 'MATHEMATICS' },
  'VOCATIONAL SKILLS': { ta: 'தொழில் திறன்', te: 'వృత్తి నైపుణ్యాలు', hi: 'व्यावसायिक कौशल', en: 'VOCATIONAL SKILLS' },
  'AGRICULTURE': { ta: 'விவசாயம்', te: 'వ్యవసాయం', hi: 'कृषि', en: 'AGRICULTURE' },
  'COMPUTER SCIENCE': { ta: 'கணினி அறிவியல்', te: 'కంప్యూటర్ సైన్స్', hi: 'कंप्यूटर साइंस', en: 'COMPUTER SCIENCE' },
  'GENERAL SCIENCE': { ta: 'பொது அறிவியல்', te: 'జనరల్ సైన్స్', hi: 'सामान्य विज्ञान', en: 'GENERAL SCIENCE' },
  'ENGLISH LANGUAGE': { ta: 'ஆங்கில மொழி', te: 'ఇంగ్లీష్ భాష', hi: 'अंग्रेजी भाषा', en: 'ENGLISH LANGUAGE' }
};

const LEVEL_TRANSLATIONS = {
  ta: 'ஆரம்ப நிலை',
  te: 'ప్రారంభ స్థాయి',
  hi: 'प्रारंभिक स्तर',
  en: 'Beginner Level'
};

const LOW_BW_TRANSLATIONS = {
  ta: 'குறைந்த இணையம்',
  te: 'తక్కువ ఇంటర్నెట్',
  hi: 'कम इंटरनेट',
  en: 'Low Data'
};

const BUTTON_TRANSLATIONS = {
  start: {
    ta: 'கற்றலைத் தொடங்குங்கள் & வீடியோக்களைப் பாருங்கள்',
    te: 'నేర్చుకోవడం ప్రారంభించండి & వీడియోలు చూడండి',
    hi: 'सीखना शुरू करें और वीडियो देखें',
    en: 'Start Learning & View Videos'
  },
  continue: {
    ta: 'தொடர்ந்து பயிலுங்கள்',
    te: 'నేర్చుకోవడం కొనసాగించండి',
    hi: 'सीखना जारी रखें',
    en: 'Continue Learning'
  }
};

const CourseCard = ({ course, progress, isEnrolled, onEnroll }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lang = language || 'en';

  const getTranslatedTitle = () => {
    const raw = course.title || '';
    return (COURSE_TRANSLATIONS[raw] && COURSE_TRANSLATIONS[raw][lang]) || raw;
  };

  const getTranslatedDesc = () => {
    const rawDesc = course.description || '';
    const rawTitle = course.title || '';
    return (DESCRIPTION_TRANSLATIONS[rawTitle] && DESCRIPTION_TRANSLATIONS[rawTitle][lang]) || rawDesc;
  };

  const getTranslatedCategory = () => {
    const cat = (course.category?.name || 'General').toUpperCase();
    return (CATEGORY_TRANSLATIONS[cat] && CATEGORY_TRANSLATIONS[cat][lang]) || cat;
  };

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
      navigate(`/student/courses/${course.id}/player`);
    }
  };

  return (
    <div className="course-card">
      <div className="course-thumbnail" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img 
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80'} 
          alt={getTranslatedTitle()} 
          loading="lazy" 
        />
        <div className="course-badges">
          <span className="badge category-badge">{getTranslatedCategory()}</span>
          <span className="badge lang-badge"><Globe size={12} /> {course.language || 'English'}</span>
          <span className="badge bw-badge"><Zap size={12} /> {LOW_BW_TRANSLATIONS[lang] || LOW_BW_TRANSLATIONS.en}</span>
        </div>
      </div>

      <div className="course-card-body">
        <h3 className="course-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {getTranslatedTitle()}
        </h3>
        <p className="course-desc">{getTranslatedDesc()}</p>
        
        <div className="course-meta">
          <span className="teacher-info">
            <User size={14} /> {course.teacher?.user?.fullName || 'Prof. Rajesh Kumar'}
          </span>
          <span className="level-info">
            {LEVEL_TRANSLATIONS[lang] || LEVEL_TRANSLATIONS.en}
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
              <BookOpen size={16} /> {BUTTON_TRANSLATIONS.continue[lang] || BUTTON_TRANSLATIONS.continue.en}
            </button>
          ) : (
            <button onClick={handleCardClick} className="btn-action btn-enroll">
              <BookOpen size={16} /> {BUTTON_TRANSLATIONS.start[lang] || BUTTON_TRANSLATIONS.start.en}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
