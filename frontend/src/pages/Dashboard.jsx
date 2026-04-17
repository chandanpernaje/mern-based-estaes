import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { PlusCircle, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    images: ''
  });
  const [myBookings, setMyBookings] = useState([]);
  const [manageBookings, setManageBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'bookings', 'manage'

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const url = user.role === 'admin' ? '/properties' : '/properties/user/me';
      const res = await axios.get(url);
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings/my-bookings');
      setMyBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
  };

  const fetchManageBookings = async () => {
    try {
      const res = await axios.get('/bookings/manage');
      setManageBookings(res.data);
    } catch (err) {
      console.error('Error fetching manage bookings', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchBookings();
      fetchManageBookings();
    }
  }, [user]);

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/bookings/${id}/status`, { status });
      fetchManageBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const toggleAvailability = async (property) => {
    try {
      await axios.put(`/properties/${property._id}`, { isAvailable: !property.isAvailable });
      fetchProperties();
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms)
      };
      // Convert comma-separated images string to array
      if (formData.images) {
        dataToSubmit.images = formData.images.split(',').map(url => url.trim()).filter(url => url !== '');
      }
      
      if (editPropertyId) {
        await axios.put(`/properties/${editPropertyId}`, dataToSubmit);
      } else {
        await axios.post('/properties', dataToSubmit);
      }

      setShowAddForm(false);
      setEditPropertyId(null);
      setFormData({ title: '', description: '', price: '', location: '', bedrooms: '', images: '' });
      fetchProperties(); // Refresh list
    } catch (err) {
      console.error('Error saving property', err);
      alert('Failed to save property');
    }
  };

  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms,
      images: property.images && property.images.length > 0 ? property.images.join(', ') : (property.imageUrl || '')
    });
    setEditPropertyId(property._id);
    setShowAddForm(true);
    setActiveTab('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error deleting property', err);
        alert('Failed to delete property');
      }
    }
  };

  if (!user) return null; // Or a redirect could be handled here if not using protected routes component

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <LayoutDashboard className="text-gradient" size={32} />
          <div>
            <h2 style={{ fontSize: '2rem' }}>Dashboard</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Welcome back, {user.name} {user.role === 'admin' ? '(Admin Mode)' : ''}
            </p>
          </div>
        </div>
        <div className="flex" style={{ gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('properties')} 
            className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-outline'}`}
          >
            Properties
          </button>
          <button 
            onClick={() => setActiveTab('bookings')} 
            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
          >
            My Bookings
          </button>
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`btn ${activeTab === 'manage' ? 'btn-primary' : 'btn-outline'}`}
          >
            Received Requests
          </button>
          <button onClick={() => {
            setShowAddForm(!showAddForm);
            if (editPropertyId) {
              setEditPropertyId(null);
              setFormData({ title: '', description: '', price: '', location: '', bedrooms: '', images: '' });
            }
          }} className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
            <PlusCircle size={20} /> {showAddForm ? 'Cancel' : 'Add Property'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card mb-12" style={{ padding: '2rem' }}>
          <h3 className="mb-6" style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            {editPropertyId ? 'Edit Property' : 'Add New Property'}
          </h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 grid-cols-md-2" style={{ gap: '1.5rem' }}>
            <div className="form-group mb-0">
              <label className="form-label">Property Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={onChange} required placeholder="e.g. Modern Villa in Suburbs" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" name="location" value={formData.location} onChange={onChange} required placeholder="e.g. 123 Main St, City" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" name="price" value={formData.price} onChange={onChange} required placeholder="e.g. 5000000" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Bedrooms</label>
              <input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} onChange={onChange} required placeholder="e.g. 3" />
            </div>
            <div className="form-group mb-0" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Image URLs (Comma separated)</label>
              <input type="text" className="form-control" name="images" value={formData.images} onChange={onChange} placeholder="https://image1.jpg, https://image2.jpg" />
            </div>
            <div className="form-group mb-0" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={onChange} required rows="3" placeholder="Describe the property..."></textarea>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">
                Save Property
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'properties' && (
        <div>
          <h3 className="mb-6" style={{ fontSize: '1.5rem' }}>
            {user.role === 'admin' ? 'All System Properties' : 'Your Managed Properties'}
          </h3>
          
          {loading ? (
             <div className="text-center py-12">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't listed any properties yet.</p>
              <button onClick={() => setShowAddForm(true)} className="btn btn-outline mt-4">
                <PlusCircle size={16} /> Add Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-md-3">
              {properties.map(property => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggleAvailability={() => toggleAvailability(property)}
                  showDelete={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h3 className="mb-6" style={{ fontSize: '1.5rem' }}>My Requested Viewings</h3>
          {myBookings.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't booked any viewings yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 grid-cols-md-2">
              {myBookings.map(booking => (
                <div key={booking._id} className="card flex items-center" style={{ padding: '1.5rem', gap: '1.5rem' }}>
                  {booking.property?.imageUrl && (
                    <img src={booking.property.imageUrl} alt="Property" style={{ width: '100px', height: '100px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{booking.property?.title || 'Deleted Property'}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{booking.property?.location}</p>
                    <div className="flex items-center" style={{ gap: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </span>
                      <span style={{ color: booking.status === 'pending' ? 'var(--text-muted)' : 'var(--success)' }}>
                        Status: {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manage' && (
        <div>
          <h3 className="mb-6" style={{ fontSize: '1.5rem' }}>Received Requests</h3>
          {manageBookings.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)' }}>No one has requested a viewing for your properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 grid-cols-md-2">
              {manageBookings.map(booking => (
                <div key={booking._id} className="card flex items-center" style={{ padding: '1.5rem', gap: '1.5rem' }}>
                  {booking.property?.images && booking.property.images.length > 0 && (
                    <img src={booking.property.images[0]} alt="Property" style={{ width: '100px', height: '100px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{booking.property?.title || 'Deleted Property'}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Requested by: {booking.user?.name} ({booking.user?.email})</p>
                    <div className="flex items-center justify-between" style={{ fontSize: '0.9rem' }}>
                      <span style={{ background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </span>
                      {booking.status === 'pending' ? (
                        <div className="flex" style={{ gap: '0.5rem' }}>
                          <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--success)', borderColor: 'var(--success)' }}>Accept</button>
                          <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ color: booking.status === 'confirmed' ? 'var(--success)' : 'var(--danger)' }}>
                          {booking.status === 'confirmed' ? 'Accepted' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
