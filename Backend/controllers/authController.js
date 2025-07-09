import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3 * 24 * 60 * 60 * 1000
      })
      .status(201)
      .json({
        message: 'User registered successfully',
        user: { id: newUser.rows[0].id, username: newUser.rows[0].username, email },
        token
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, email },
        token
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};