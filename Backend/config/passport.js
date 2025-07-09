import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from './db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails[0].value;
      const username = profile.displayName;

      try {
        const userCheck = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [googleId]
        );

        if (userCheck.rows.length > 0) {
          return done(null, userCheck.rows[0]);
        }

        // 🔐 Hash a placeholder password before inserting
        const hashedPassword = await bcrypt.hash('google_oauth', 10);

        const newUser = await pool.query(
          'INSERT INTO users (username, email, google_id, password) VALUES ($1, $2, $3, $4) RETURNING *',
          [username, email, googleId, hashedPassword]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        console.error('Google Auth Error:', err);
        return done(err, null);
      }
    }
  )
);
