const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  programs: [{
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    status: { type: String, enum: ['Confirmed', 'Waitlisted', 'Rejected'], default: 'Waitlisted' }
  }],
  childName: { en: String, es: String },
  age: String,
  parentName: { en: String, es: String },
  email: String,
  emergencyContact: { en: String, es: String },
  gender: { en: String, es: String },
  primaryLanguage: { en: String, es: String },
  familyIncome: { en: String, es: String },
  householdVehicle: { en: String, es: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);
