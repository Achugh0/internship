import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Company from '../models/Company.js';

const router = express.Router();

router.get('/profile', authenticate, authorize('company'), async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticate, authorize('company'), async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { profile: req.body } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/trust-score', async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select('trustScore statistics');
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.json({ success: true, data: company.trustScore });
  } catch (error) {
    next(error);
  }
});

export default router;
