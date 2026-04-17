import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'user' // Default to user, could allow choosing admin for demo purposes
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-12 flex justify-center">
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <UserPlus className="text-gradient" size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join PrimeEstates today</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '0.25rem', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              value={name} 
              onChange={onChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              value={email} 
              onChange={onChange} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              value={password} 
              onChange={onChange} 
              required 
              minLength="6"
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select 
              className="form-control" 
              name="role" 
              value={role} 
              onChange={onChange}
              style={{ appearance: 'none', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
            >
              <option value="user">Standard User (Buyer/Seller)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">
            Create Account
          </button>
        </form>

        <div className="text-center mt-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
