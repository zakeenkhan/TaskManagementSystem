import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is already in localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsChecking(false);
      return;
    }

    // Check if this is a Google OAuth callback
    const urlParams = new URLSearchParams(location.search);
    const userData = urlParams.get('user');
    
    if (userData) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userData));
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(decodedUser));
        localStorage.setItem('token', decodedUser.token);
        
        setUser(decodedUser);
        console.log('Google OAuth successful:', decodedUser);

        // Redirect to /dashboard after setting localStorage
        window.location.replace('/dashboard');
        return;
      } catch (error) {
        console.error('Error parsing user data from Google OAuth:', error);
      }
    }
    
    setIsChecking(false);
  }, [location.search]);

  // Show loading state while checking authentication
  if (isChecking) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;