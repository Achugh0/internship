import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: {
    skills: [String],
    education: String,
    experience: String
  },
  details: {
    stipend: { amount: Number, currency: { type: String, default: 'INR' } },
    duration: { value: Number, unit: { type: String, default: 'months' } },
    workMode: { type: String, enum: ['remote', 'hybrid', 'office'], required: true },
    location: String,
    hoursPerWeek: Number,
    startDate: Date,
    positions: { type: Number, default: 1 }
  },
  learningOutcomes: [String],
  assessmentTask: {
    required: Boolean,
    description: String,
    maxHours: Number,
    commercialUse: Boolean
  },
  applicationProcess: {
    steps: [String],
    expectedTimeline: String
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'active', 'paused', 'closed', 'rejected'],
    default: 'draft'
  },
  moderationNotes: String,
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

internshipSchema.index({ title: 'text', description: 'text' });
internshipSchema.index({ 'details.workMode': 1, 'details.location': 1 });

export default mongoose.model('Internship', internshipSchema);
