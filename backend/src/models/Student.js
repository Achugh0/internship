import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  profile: {
    fullName: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    college: String,
    degree: String,
    graduationYear: Number,
    location: String,
    bio: String,
    profilePicture: String
  },
  skills: [{
    name: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    verified: { type: Boolean, default: false }
  }],
  portfolio: [{
    title: String,
    description: String,
    url: String,
    images: [String],
    skills: [String],
    supervisorVerified: { type: Boolean, default: false }
  }],
  workSamples: [{
    title: String,
    type: String,
    fileUrl: String,
    timestamp: Date,
    watermarked: Boolean
  }],
  preferences: {
    stipendRange: { min: Number, max: Number },
    locations: [String],
    workMode: [{ type: String, enum: ['remote', 'hybrid', 'office'] }],
    duration: { min: Number, max: Number },
    industries: [String]
  },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  savedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }]
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
