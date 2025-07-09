import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import GoogleIcon from '../assets/GoogleIcon';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(8),
  borderRadius: '16px',
  boxShadow: '0px 8px 24px rgba(0,0,0,0.05)',
}));

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        credentials: 'include', // ⬅️ Required for cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // optional

      console.log('Signup successful:', data);
      navigate('/dashboard'); // Redirect
    } catch (err) {
      console.error('Signup error:', err.message);
      alert(err.message);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom textAlign="center">
          📝 Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              fullWidth
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Sign Up
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          onClick={handleGoogleSignup}
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
        >
          Sign Up with Google
        </Button>

        <Typography variant="body2" color="text.secondary" mt={3} textAlign="center">
          Already have an account? <a href="/login">Log in</a>
        </Typography>
      </StyledPaper>
    </Container>
  );
}

export default Signup;
