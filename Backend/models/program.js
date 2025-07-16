const mongoose = require('mongoose');
const programSchema = new mongoose.Schema({
  name: { en: String, es: String },
  ageGroup: { en: String, es: String },
  location: { en: String, es: String },
  duration: { en: String, es: String },
  schedule: { en: String, es: String },
  description: { en: String, es: String },
  contact: { en: String, es: String },
  eligibility: { en: String, es: String },
  lastUpdated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Program', programSchema);