import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Student from '../models/Student.js';

const router = express.Router();

router.get('/profile', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

router.post('/skills', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { name, level } = req.body;
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { skills: { name, level, verified: false } } },
      { new: true }
    );
    res.json({ success: true, data: student.skills });
  } catch (error) {
    next(error);
  }
});

router.post('/portfolio', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { portfolio: req.body } },
      { new: true }
    );
    res.json({ success: true, data: student.portfolio });
  } catch (error) {
    next(error);
  }
});

export default router;
