import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  profile: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website: String,
    linkedinUrl: String,
    description: String,
    logo: String,
    industry: String,
    size: String,
    location: String
  },
  verification: {
    status: { 
      type: String, 
      enum: ['pending', 'basic', 'enhanced', 'premium', 'rejected'],
      default: 'pending'
    },
    gstNumber: String,
    gstVerified: { type: Boolean, default: false },
    documentsSubmitted: [String],
    verifiedAt: Date,
    verificationFee: { paid: Boolean, amount: Number, date: Date }
  },
  trustScore: {
    score: { type: Number, default: 50, min: 0, max: 100 },
    responseRate: { type: Number, default: 0 },
    paymentReliability: { type: Number, default: 0 },
    internRatings: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    ghostingIncidents: { type: Number, default: 0 },
    lastUpdated: Date
  },
  statistics: {
    totalInternships: { type: Number, default: 0 },
    activeInternships: { type: Number, default: 0 },
    completedInternships: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 }
  },
  escrowAccount: {
    balance: { type: Number, default: 0 },
    deposits: [{ amount: Number, internshipId: String, date: Date }]
  },
  flags: {
    isSuspended: { type: Boolean, default: false },
    isBlacklisted: { type: Boolean, default: false },
    suspensionReason: String,
    flagCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
