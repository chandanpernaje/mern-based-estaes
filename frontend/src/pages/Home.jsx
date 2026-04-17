import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Error fetching properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div style={{ padding: '4rem 0', textAlign: 'center', background: 'var(--gradient-card)' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            Find Your <span className="text-gradient">Dream Home</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Discover the most premium properties in the most desirable locations. Your perfect sanctuary is just a click away.
          </p>
        </div>
      </div>

      {/* Properties Section */}
      <div className="container py-12">
        <div className="flex items-center mb-8" style={{ gap: '0.75rem' }}>
          <HomeIcon className="text-gradient" size={28} />
          <h2 style={{ fontSize: '2rem' }}>Latest Properties</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(79, 70, 229, 0.3)', borderRadius: '50%', borderTopColor: 'var(--primary-color)', animation: 'spin 1s ease-in-out infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <p>No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-md-3">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
