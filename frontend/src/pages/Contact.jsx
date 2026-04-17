import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-12">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Contact <span className="text-gradient">Us</span></h2>

      <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '3rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send us a message</h3>
          {status && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{status}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact Information</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Have questions about a property or need help with your account? Our support team is here to help!
          </p>

          <div className="flex items-center mb-6" style={{ gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Phone</h4>
              <p style={{ color: 'var(--text-muted)' }}>0825120043</p>
            </div>
          </div>

          <div className="flex items-center mb-6" style={{ gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Email</h4>
              <p style={{ color: 'var(--text-muted)' }}>support@primeestates.com</p>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Office</h4>
              <p style={{ color: 'var(--text-muted)' }}>Pernaje NH47, Pernaje International</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
