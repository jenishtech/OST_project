const express = require('express');
const router = express.Router();
const Program = require('../models/program');


// Get programs with language support
router.get('/programs', async (req, res) => {
  const { age, location, schedule, search, lang = 'en' } = req.query;
  let query = {};
  if (age) query[`ageGroup.${lang}`] = age;
  if (location) query[`location.${lang}`] = location;
  if (schedule) query[`schedule.${lang}`] = schedule;
  if (search) query[`name.${lang}`] = new RegExp(search, 'i');
  const programs = await Program.find(query);
  const localizedPrograms = programs.map(p => ({
    ...p._doc,
    name: p.name[lang],
    ageGroup: p.ageGroup[lang],
    location: p.location[lang],
    duration: p.duration[lang],
    schedule: p.schedule[lang],
    description: p.description[lang],
    contact: p.contact[lang],
    eligibility: p.eligibility[lang]
  }));
  res.json(localizedPrograms);
});


// Get program by ID with language support
router.get('/programs/:id', async (req, res) => {
  const { lang = 'en' } = req.query;
  const program = await Program.findById(req.params.id);
  if (!program) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...program._doc,
    name: program.name[lang],
    ageGroup: program.ageGroup[lang],
    location: program.location[lang],
    duration: program.duration[lang],
    schedule: program.schedule[lang],
    description: program.description[lang],
    contact: program.contact[lang],
    eligibility: program.eligibility[lang]
  });
});


// Get unique filter options with language support
router.get('/programs-filters', async (req, res) => {
  const { lang = 'en' } = req.query;
  const ageGroups = await Program.distinct(`ageGroup.${lang}`);
  const locations = await Program.distinct(`location.${lang}`);
  const schedules = await Program.distinct(`schedule.${lang}`);
  res.json({ ageGroups, locations, schedules });
});


module.exports = router;