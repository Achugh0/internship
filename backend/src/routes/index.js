import express from 'express';
import authRoutes from './auth.js';
import studentRoutes from './students.js';
import companyRoutes from './companies.js';
import internshipRoutes from './internships.js';
import applicationRoutes from './applications.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/internships', internshipRoutes);
router.use('/applications', applicationRoutes);

export default router;
