import React from 'react';
import { BookOpen, Target, Heart, Award, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
        <span className="badge badge-green">Our Purpose</span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '0.6rem' }}>Bridging the Rural-Urban Educational Divide</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--neutral-600)', marginTop: '1rem' }}>
          Rural Education Platform was built to ensure that location, internet constraints, or financial barriers never stand between a passionate student and quality learning.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'center', marginBottom: '4rem' }}>
        <img 
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" 
          alt="Rural Student Learning" 
          style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}
        />
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Mission & Core Vision</h2>
          <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Millions of bright students residing in rural villages lack access to specialized subject teachers, updated study notes, and self-assessment tools. RuralEdu provides an end-to-end digital ecosystem where dedicated teachers publish structured courses, video lectures, and PDF materials accessible on any smartphone or computer.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <Target color="#059669" size={24} style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Equal Opportunity</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)' }}>Free, high-standard curriculum matching urban board standards.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <ShieldCheck color="#0284c7" size={24} style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Low Bandwidth & Offline Design</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)' }}>Compressed video streaming and small PDF downloads for weak network areas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
