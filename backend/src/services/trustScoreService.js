import Company from '../models/Company.js';
import { pgPool } from '../config/database.js';

export const calculateTrustScore = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Company not found');

  const weights = {
    responseRate: 0.25,
    paymentReliability: 0.30,
    internRatings: 0.20,
    completionRate: 0.15,
    ghostingPenalty: 0.10
  };

  const score = Math.round(
    (company.trustScore.responseRate * weights.responseRate) +
    (company.trustScore.paymentReliability * weights.paymentReliability) +
    (company.trustScore.internRatings * weights.internRatings) +
    (company.trustScore.completionRate * weights.completionRate) -
    (company.trustScore.ghostingIncidents * weights.ghostingPenalty * 10)
  );

  const finalScore = Math.max(0, Math.min(100, score));

  await Company.findByIdAndUpdate(companyId, {
    'trustScore.score': finalScore,
    'trustScore.lastUpdated': new Date()
  });

  await pgPool.query(
    'INSERT INTO trust_score_history (company_id, score, reason) VALUES ($1, $2, $3)',
    [companyId, finalScore, 'Automated calculation']
  );

  return finalScore;
};

export const updateResponseRate = async (companyId) => {
  const company = await Company.findById(companyId);
  const applications = await Application.find({ companyId });

  const respondedWithin7Days = applications.filter(app => {
    const firstResponse = app.statusHistory.find(h => h.status !== 'submitted');
    if (!firstResponse) return false;
    const daysDiff = (firstResponse.timestamp - app.createdAt) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const responseRate = applications.length > 0 
    ? (respondedWithin7Days / applications.length) * 100 
    : 0;

  await Company.findByIdAndUpdate(companyId, {
    'trustScore.responseRate': responseRate
  });

  return responseRate;
};

export const updatePaymentReliability = async (companyId) => {
  const payments = await pgPool.query(
    'SELECT status FROM payment_tracking WHERE company_id = $1',
    [companyId]
  );

  const total = payments.rows.length;
  if (total === 0) return 0;

  const onTime = payments.rows.filter(p => p.status === 'on_time').length;
  const reliability = (onTime / total) * 100;

  await Company.findByIdAndUpdate(companyId, {
    'trustScore.paymentReliability': reliability
  });

  return reliability;
};
