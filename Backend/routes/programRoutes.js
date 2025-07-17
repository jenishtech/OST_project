const express = require('express');
const router = express.Router();
const Program = require('../models/program');


// Get programs with language support
router.get('/programs', async (req, res) => {
  const { age, location, schedule, search, lang = 'en', zip } = req.query;

  let query = {};
  if (age) query[`ageGroup.${lang}`] = age;
  if (location) query[`location.${lang}`] = location;
  if (schedule) query[`schedule.${lang}`] = schedule;
  if (zip) query['zip'] = zip; // match zip exactly

  if (search && search.trim()) {
    query[`name.${lang}`] = new RegExp(search.trim(), 'i'); // ✅ trim before regex
  }

  const programs = await Program.find(query);
  const localized = programs.map(p => ({
    ...p._doc,
    name: p.name[lang],
    ageGroup: p.ageGroup[lang],
    location: p.location[lang],
    duration: p.duration[lang],
    schedule: p.schedule[lang],
    description: p.description[lang],
    contact: p.contact[lang],
    eligibility: p.eligibility[lang],
  }));

  res.json(localized);
});



// Get unique filter options with language support
router.get('/programs-filters', async (req, res) => {
  const { lang = 'en', zip } = req.query;

  // build base query: only include programs matching zip if zip is given
  let baseQuery = {};
  if (zip) baseQuery.zip = zip;

  const ageGroups = await Program.distinct(`ageGroup.${lang}`, baseQuery);
  const locations = await Program.distinct(`location.${lang}`, baseQuery);
  const schedules = await Program.distinct(`schedule.${lang}`, baseQuery);

  res.json({ ageGroups, locations, schedules });
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



module.exports = router;