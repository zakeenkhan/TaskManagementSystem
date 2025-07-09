import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// 🔐 Signup / Login / Logout
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// 🌐 Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google OAuth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    (req, res) => {
        const user = req.user;
        const token = generateToken(user.id);

        // Set JWT cookie from passport
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'Lax',
        });

        // Pass user data and token to frontend via query params
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            token: token,
        };
        const encodedUser = encodeURIComponent(JSON.stringify(userData));
        // Redirect to frontend, frontend should store in localStorage
        res.redirect(`http://localhost:3001/dashboard?user=${encodedUser}`);
    }
);

export default router;
