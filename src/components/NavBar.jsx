import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { Button } from '@mui/material';

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logoutUser = async () => {
    try {
      const res = await fetch('https://tmsbackend.netlify.app/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // optional
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Taskify</h2>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/dashboard">Dashboard</Link></li>}
        {!user && (
          <>
            
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>

      <div className="auth-controls">
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Welcome, {user.username} 👋</span>
            <Button variant="outlined" color="error" onClick={logoutUser}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
