import React, { useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
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

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // 🔒 Important for sending/receiving cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user & token in localStorage (token is optional)
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // If you want to store token

      console.log('Login successful:', data);
      navigate('/dashboard'); // ✅ Redirect after successful login
    } catch (err) {
      console.error('Login error:', err.message);
      alert(err.message || 'Login failed.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom textAlign="center">
          🔐 Login to Taskify
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
        >
          Sign In with Google
        </Button>

        <Typography variant="body2" color="text.secondary" mt={3} textAlign="center">
          Don't have an account? <a href="/signup">Sign up</a>
        </Typography>
      </StyledPaper>
    </Container>
  );
}

export default Login;
