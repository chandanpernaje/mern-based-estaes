import React from 'react';
import { Info, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="container py-12">
      <div className="flex items-center mb-8" style={{ gap: '0.75rem' }}>
        <Info className="text-gradient" size={32} />
        <h2 style={{ fontSize: '2.5rem' }}>About Us</h2>
      </div>

      <div className="card" style={{ padding: '3rem' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Welcome to Prime<span className="text-gradient">Estates</span></h3>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>
          We are the leading real estate platform dedicated to helping you find your dream home. 
          Whether you are looking for a modern apartment in the city or a spacious suburban house, 
          our extensive catalog of premium properties guarantees that you will find exactly what you need.
        </p>

        <div className="grid grid-cols-1 grid-cols-md-3 mt-8">
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={40} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verified Listings</h4>
            <p style={{ color: 'var(--text-muted)' }}>Every property on our platform is thoroughly verified.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={40} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Easy Booking</h4>
            <p style={{ color: 'var(--text-muted)' }}>Schedule a house viewing with just one click.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={40} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Platform</h4>
            <p style={{ color: 'var(--text-muted)' }}>Your data and transactions are completely secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
