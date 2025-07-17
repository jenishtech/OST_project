const express = require('express');
const router = express.Router();
const Registration = require('../models/registration');

router.post('/register', async (req, res) => {
  const { programIds, childName, age, parentName, email, emergencyContact, gender, primaryLanguage, familyIncome, householdVehicle } = req.body;

  console.log('Received registration data:', req.body);

  // Validate programId
  if (!programIds || !programIds.length) {
    return res.status(400).json({ error: 'Program IDs are required' });
  }

  const programs = programIds.map(id => ({
    programId: id,
    status: ['Confirmed', 'Waitlisted', 'Rejected'][Math.floor(Math.random() * 3)]
  }));

  const registration = new Registration({
    programs,
    childName,
    age,
    parentName,
    email,
    emergencyContact,
    gender,
    primaryLanguage,
    familyIncome,
    householdVehicle
  });
  await registration.save();

  // Simulate real-time status update after 2 seconds (for demo)
  // setTimeout(async () => {
    // registration.status = ['Confirmed', 'Waitlisted', 'Rejected'][Math.floor(Math.random() * 3)];
    // await registration.save();
    res.json(registration);
  // }, 1000);
});

// Status route
router.get('/status/:id', async (req, res) => {
  const { lang = 'en' } = req.query;
  console.log('Fetching status for registration ID:', req.params.id);
  const registration = await Registration.findById(req.params.id).populate('programs.programId');
  if (!registration) return res.status(404).json({ error: 'Not found' });

  res.json({
    ...registration._doc,
    childName: registration.childName?.[lang] || '',
    parentName: registration.parentName?.[lang] || '',
    emergencyContact: registration.emergencyContact?.[lang] || '',
    gender: registration.gender?.[lang] || '',
    primaryLanguage: registration.primaryLanguage?.[lang] || '',
    familyIncome: registration.familyIncome?.[lang] || '',
    householdVehicle: registration.householdVehicle?.[lang] || ''
  });
});

module.exports = router;