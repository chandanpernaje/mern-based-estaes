import React, { useState, useContext } from 'react';
import { MapPin, Bed, Trash2, Calendar, Clock, X, Edit2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PropertyCard = ({ property, onDelete, onEdit, onToggleAvailability, showDelete }) => {
  const { user } = useContext(AuthContext);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '' });
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      setBookingStatus('');
      await axios.post('/bookings', {
        property: property._id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot
      });
      setBookingStatus('success');
      setTimeout(() => {
        setShowBooking(false);
        setBookingStatus('');
        setBookingData({ date: '', timeSlot: '' });
      }, 3000);
    } catch (err) {
      setBookingStatus(err.response?.data?.error || 'error');
    }
  };

  // Indian Rupee formatting
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ height: '200px', overflowX: 'auto', overflowY: 'hidden', display: 'flex', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }} className="image-gallery">
        {(!property.isAvailable) && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 'bold', zIndex: 5, fontSize: '0.8rem', boxShadow: 'var(--shadow-sm)' }}>
            Not Available
          </div>
        )}
        {((property.images && property.images.length > 0) ? property.images : (property.imageUrl ? [property.imageUrl] : [])).map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`${property.title} - ${index + 1}`} 
            style={{ minWidth: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start' }}
          />
        ))}
      </div>
      {/* Hide scrollbar logic can be placed in index.css if needed */}
      <div style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-2">
          <h3 style={{ fontSize: '1.25rem' }}>{property.title}</h3>
          <span className="text-gradient" style={{ fontWeight: '700', fontSize: '1.2rem' }}>
            {formattedPrice}
          </span>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {property.description}
        </p>
        
        <div className="flex" style={{ gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <span className="flex items-center" style={{ gap: '0.25rem' }}>
            <MapPin size={16} /> {property.location}
          </span>
          <span className="flex items-center" style={{ gap: '0.25rem' }}>
            <Bed size={16} /> {property.bedrooms} Beds
          </span>
        </div>

        {property.owner && property.owner.name && (
           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
             Listed by: {property.owner.name}
           </div>
        )}

        {/* Buttons */}
        <div className="flex" style={{ gap: '0.5rem', flexDirection: 'column' }}>
          {!showDelete && user && property.isAvailable && (
            <button 
              onClick={() => setShowBooking(!showBooking)} 
              className="btn btn-primary w-full"
            >
              <Calendar size={16} /> {showBooking ? 'Cancel Booking' : 'Book Viewing'}
            </button>
          )}

          {showDelete && (
            <>
              <div className="flex" style={{ gap: '0.5rem', flexDirection: 'row' }}>
                <button 
                  onClick={() => onEdit(property)} 
                  className="btn btn-outline w-full"
                  style={{ color: 'var(--text-main)', borderColor: 'var(--primary-color)' }}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  onClick={() => onDelete(property._id)} 
                  className="btn btn-danger w-full"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
              <button 
                onClick={() => onToggleAvailability()} 
                className="btn btn-outline w-full"
                style={{ color: property.isAvailable ? 'var(--danger)' : 'var(--success)', borderColor: property.isAvailable ? 'var(--danger)' : 'var(--success)' }}
              >
                {property.isAvailable ? 'Mark as Not Available' : 'Mark as Available'}
              </button>
            </>
          )}
        </div>

        {/* Booking Form Overlay */}
        {showBooking && (
          <div className="booking-overlay" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
            <div className="flex justify-between items-center mb-2">
              <h4 style={{ fontSize: '1rem' }}>Schedule Viewing</h4>
              <button onClick={() => setShowBooking(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            
            {bookingStatus === 'success' ? (
              <div style={{ color: 'var(--success)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                Booking confirmed! We will contact you soon.
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Date</label>
                  <input type="date" className="form-control" style={{ padding: '0.5rem' }} required 
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Time</label>
                  <input type="time" className="form-control" style={{ padding: '0.5rem' }} required 
                    value={bookingData.timeSlot} onChange={e => setBookingData({...bookingData, timeSlot: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary w-full" style={{ padding: '0.5rem' }}>
                  Confirm Slot
                </button>
                {bookingStatus && bookingStatus !== 'success' && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    {bookingStatus === 'error' ? 'Failed to book slot' : bookingStatus}
                  </p>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
