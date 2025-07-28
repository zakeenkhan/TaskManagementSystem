// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { pool } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 🔹 New
import './config/passport.js';
import passport from 'passport';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://taskmanagementsystem12.netlify.app',
  credentials: true                // ✅ Allow cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); // 🔹 Add authentication routes

// Test DB connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL DB'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Export app for serverless deployment
export default app;

// Start Server (only in development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
