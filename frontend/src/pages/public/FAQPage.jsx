import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Is Rural Education Platform completely free for students?",
      a: "Yes! All courses, video lectures, downloadable PDF notes, quizzes, and certificates are 100% free for all rural and urban students."
    },
    {
      q: "Will video lectures work on low 2G or 3G internet speeds?",
      a: "Absolutely. Our platform is optimized for low bandwidth connections. Video lectures use adaptive compression and PDF notes are lightweight so they load fast even on basic smartphones."
    },
    {
      q: "How can teachers register to publish courses?",
      a: "Teacher accounts are created or approved by Administrators to maintain high academic standards. Interested educators can contact support@ruraledu.org to request teacher credentials."
    },
    {
      q: "Can I download study notes to read offline?",
      a: "Yes! All PDF notes and formula sheets have a direct download button so students can save them on their phones and study offline without internet."
    },
    {
      q: "How do students earn certificates?",
      a: "Once a student enrolls in a course, completes the video lessons, and attempts the associated quizzes, an official Certificate of Completion is generated in their student dashboard."
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-blue"><HelpCircle size={14} /> Help Center</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--neutral-600)', marginTop: '0.5rem' }}>Everything you need to know about using RuralEdu.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }} onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}>
            <div className="flex-between">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--neutral-900)' }}>{faq.q}</h3>
              {openIndex === idx ? <ChevronUp size={20} color="var(--primary-600)" /> : <ChevronDown size={20} color="var(--neutral-500)" />}
            </div>
            {openIndex === idx && (
              <p style={{ marginTop: '1rem', color: 'var(--neutral-600)', borderTop: '1px solid var(--neutral-200)', paddingTop: '0.8rem', lineHeight: '1.7' }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
