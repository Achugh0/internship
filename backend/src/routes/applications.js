import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Internship from '../models/Internship.js';

const router = express.Router();

router.post('/', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { internshipId, coverLetter, resume } = req.body;

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    const existingApplication = await Application.findOne({
      studentId: student._id,
      internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'Already applied to this internship' });
    }

    const application = new Application({
      studentId: student._id,
      internshipId,
      companyId: internship.companyId,
      coverLetter,
      resume,
      statusHistory: [{ status: 'submitted', timestamp: new Date() }]
    });

    await application.save();

    await Internship.findByIdAndUpdate(internshipId, {
      $push: { applications: application._id },
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.get('/my-applications', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    const applications = await Application.find({ studentId: student._id })
      .populate('internshipId', 'title details')
      .populate('companyId', 'profile.name profile.logo')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticate, authorize('company'), async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date(), note } }
      },
      { new: true }
    );

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

export default router;
