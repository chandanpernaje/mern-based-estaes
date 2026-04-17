import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          <Building className="text-gradient" />
          <span>Prime<span className="text-gradient">Estates</span></span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="flex items-center" style={{ gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  <UserIcon size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/>
                  {user.name} {user.role === 'admin' ? '(Admin)' : ''}
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
