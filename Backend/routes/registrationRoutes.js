const express = require('express');
const router = express.Router();
const Registration = require('../models/registration');

router.post('/register', async (req, res) => {
  const { programId, childName, age, parentName, email, emergencyContact, gender, primaryLanguage, familyIncome, householdVehicle } = req.body;

  // Validate programId
  if (!programId || programId === '') {
    return res.status(400).json({ error: 'Program ID is required' });
  }

  const registration = new Registration({
    programId,
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
  setTimeout(async () => {
    registration.status = ['Confirmed', 'Waitlisted', 'Rejected'][Math.floor(Math.random() * 3)];
    await registration.save();
    res.json(registration);
  }, 1000);
});

router.get('/status/:id', async (req, res) => {
  const { lang = 'en' } = req.query;
  const registration = await Registration.findById(req.params.id);
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