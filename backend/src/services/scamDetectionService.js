import Internship from '../models/Internship.js';
import { pgPool } from '../config/database.js';
import logger from '../utils/logger.js';

const SCAM_KEYWORDS = [
  'registration fee', 'pay to apply', 'deposit required',
  'earn from home', 'guaranteed income', 'no experience needed',
  'work from phone', 'easy money', 'investment opportunity'
];

const SUSPICIOUS_PATTERNS = {
  highStipend: 50000,
  tooManyPositions: 50,
  vagueDescription: 50
};

export const detectScamPatterns = async (internshipData) => {
  const flags = [];
  let riskScore = 0;

  const text = `${internshipData.title} ${internshipData.description}`.toLowerCase();
  
  SCAM_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      flags.push(`Contains suspicious keyword: "${keyword}"`);
      riskScore += 20;
    }
  });

  if (internshipData.details.stipend.amount > SUSPICIOUS_PATTERNS.highStipend) {
    flags.push('Unusually high stipend for entry-level position');
    riskScore += 15;
  }

  if (internshipData.details.positions > SUSPICIOUS_PATTERNS.tooManyPositions) {
    flags.push('Suspiciously high number of positions');
    riskScore += 25;
  }

  if (internshipData.description.length < SUSPICIOUS_PATTERNS.vagueDescription) {
    flags.push('Description too vague or short');
    riskScore += 10;
  }

  const company = await Company.findById(internshipData.companyId);
  if (company && company.trustScore.score < 30) {
    flags.push('Company has low trust score');
    riskScore += 30;
  }

  return {
    isScam: riskScore >= 50,
    riskScore,
    flags,
    recommendation: riskScore >= 50 ? 'reject' : riskScore >= 30 ? 'review' : 'approve'
  };
};

export const checkCompanyBehavior = async (companyId) => {
  const recentListings = await Internship.find({
    companyId,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (recentListings.length > 20) {
    logger.warn(`Company ${companyId} posted ${recentListings.length} listings in 24h`);
    return { suspicious: true, reason: 'Too many listings in short time' };
  }

  const identicalListings = recentListings.filter((listing, idx, arr) => 
    arr.findIndex(l => l.title === listing.title && l.description === listing.description) !== idx
  );

  if (identicalListings.length > 5) {
    return { suspicious: true, reason: 'Multiple identical listings' };
  }

  return { suspicious: false };
};

export const aggregateScamReports = async (companyId) => {
  const recentReports = await pgPool.query(
    `SELECT COUNT(*) as count FROM scam_reports 
     WHERE company_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'`,
    [companyId]
  );

  const count = parseInt(recentReports.rows[0].count);

  if (count >= 3) {
    await Company.findByIdAndUpdate(companyId, {
      'flags.isSuspended': true,
      'flags.suspensionReason': 'Multiple scam reports in 24 hours',
      'flags.flagCount': count
    });

    logger.warn(`Company ${companyId} auto-suspended due to ${count} reports`);
    return { suspended: true, reportCount: count };
  }

  return { suspended: false, reportCount: count };
};
