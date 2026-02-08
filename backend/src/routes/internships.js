import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Internship from '../models/Internship.js';
import Company from '../models/Company.js';

const router = express.Router();

router.post('/', authenticate, authorize('company'), async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company profile not found' });
    }

    const internship = new Internship({
      ...req.body,
      companyId: company._id,
      status: 'pending_review'
    });

    await internship.save();
    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { 
      search, workMode, location, minStipend, maxStipend, 
      page = 1, limit = 20 
    } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (workMode) {
      query['details.workMode'] = workMode;
    }
    if (location) {
      query['details.location'] = new RegExp(location, 'i');
    }
    if (minStipend || maxStipend) {
      query['details.stipend.amount'] = {};
      if (minStipend) query['details.stipend.amount'].$gte = Number(minStipend);
      if (maxStipend) query['details.stipend.amount'].$lte = Number(maxStipend);
    }

    const internships = await Internship.find(query)
      .populate('companyId', 'profile.name profile.logo trustScore.score')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Internship.countDocuments(query);

    res.json({ 
      success: true, 
      data: internships,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('companyId', 'profile trustScore statistics');
    
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    await Internship.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, data: internship });
  } catch (error) {
    next(error);
  }
});

export default router;
