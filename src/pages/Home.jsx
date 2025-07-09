import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';

function Home() {
  const sharedBgColor = '#e3f2fd';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
      }}
    >
      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Box textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#1f2937',
              fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
            }}
          >
            👋 Welcome to <strong>Taskify</strong>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: '750px',
              mx: 'auto',
              mb: 4,
              fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
            }}
          >
            Taskify is a simple yet powerful task management system built to help you stay organized and productive every day. Whether you're managing personal goals or planning professional projects, Taskify provides an intuitive space where you can easily create tasks, track daily activities, and prioritize what matters most.



          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
        
            <Button variant="outlined" color="primary" size="large" href="/dashboard">
              Visit Dashboard
            </Button>
          </Stack>

          <Box sx={{ mt: 6 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: '0.95rem',
                fontStyle: 'italic',
                fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
              }}
            >
             Crafted with precision, powered by modern technology — where every line of code serves a purpose.
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          backgroundColor: sharedBgColor,
          textAlign: 'center',
          borderTop: '1px solid #ccc',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
            fontSize: '0.85rem',
          }}
        >
          © {new Date().getFullYear()} Taskify — All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
