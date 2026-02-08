import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: {
    type: String,
    enum: ['submitted', 'viewed', 'shortlisted', 'interview_scheduled', 'rejected', 'offer_made', 'accepted', 'declined'],
    default: 'submitted'
  },
  coverLetter: String,
  resume: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  interview: {
    scheduled: Boolean,
    date: Date,
    mode: String,
    link: String,
    feedback: String
  },
  offer: {
    made: Boolean,
    letterUrl: String,
    acceptedAt: Date,
    declinedAt: Date
  },
  rejectionReason: String,
  fitScore: Number
}, { timestamps: true });

applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
