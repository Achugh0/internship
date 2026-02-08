import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pgPool } from '../config/database.js';

const router = express.Router();

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['student', 'company']),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password, role, fullName } = req.body;

      const existingUser = await pgPool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pgPool.query(
        'INSERT INTO users (email, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
        [email, hashedPassword, role, fullName]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({ success: true, token, user });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const result = await pgPool.query(
        'SELECT id, email, password, role FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
