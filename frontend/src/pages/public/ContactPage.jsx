import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await axiosClient.post('/public/contact', formData);
      setStatus({ type: 'success', msg: res.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <span className="badge badge-green">Get In Touch</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>We'd Love to Hear From You</h1>
        <p style={{ color: 'var(--neutral-600)', marginTop: '0.5rem' }}>
          Have a question about courses, technical support, or partnership opportunities for rural schools? Contact us below.
        </p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>
          {status && (
            <div className={`badge ${status.type === 'success' ? 'badge-green' : 'badge-amber'}`} style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', justifyContent: 'center' }}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                placeholder="e.g. ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Course feedback or Inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="form-control" 
                rows="4" 
                required 
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? 'Sending...' : <>Send Message <Send size={16} /></>}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-100)', padding: '1rem', borderRadius: '50%' }}>
              <MapPin color="#059669" size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Headquarters</h4>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>Rural Learning Resource Center, MP 462001, India</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--accent-50)', padding: '1rem', borderRadius: '50%' }}>
              <Mail color="#0284c7" size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Email Support</h4>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>support@ruraledu.org / info@ruraledu.org</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%' }}>
              <Phone color="#d97706" size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Helpline</h4>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>+91 98765 43210 (Toll Free)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
