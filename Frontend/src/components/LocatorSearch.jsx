import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/locator.css';

function LocatorSearch() {
  const { t, i18n } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({ age: '', location: '', schedule: '', search: '' });
  const [uniqueFilters, setUniqueFilters] = useState({ ageGroups: [], locations: [], schedules: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/programs-filters', { params: { lang: i18n.language } })
      .then(res => setUniqueFilters(res.data))
      .catch(err => console.log(err));

    axios.get('http://localhost:5000/api/programs', { params: { ...filters, lang: i18n.language } })
      .then(res => setPrograms(res.data))
      .catch(err => console.log(err));
  }, [filters, i18n.language]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="locator-container">
      <div className="header">
        <span>Logo</span>
        <select className="language" onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>
      <h2>{t('find_programs')}</h2>
      <input
        type="text"
        name="search"
        placeholder={t('search_placeholder')}
        className="search-bar"
        value={filters.search}
        onChange={handleSearchChange}
      />
      <div className="filters">
        <select name="age" onChange={handleFilterChange} className="filter" value={filters.age}>
          <option value="">{t('age')}</option>
          {uniqueFilters.ageGroups.map((age, index) => (
            <option key={index} value={age}>{age}</option>
          ))}
        </select>
        <select name="location" onChange={handleFilterChange} className="filter" value={filters.location}>
          <option value="">{t('location')}</option>
          {uniqueFilters.locations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
        <select name="schedule" onChange={handleFilterChange} className="filter" value={filters.schedule}>
          <option value="">{t('schedule')}</option>
          {uniqueFilters.schedules.map((sched, index) => (
            <option key={index} value={sched}>{sched}</option>
          ))}
        </select>
      </div>

      <div className="program-list">
        {programs.length > 0 ? (
          programs.map(program => (
            <div key={program._id} className="program-card">
              <h3>{program.name}</h3>
              <p> <span className='p-lable'>{t('age_group')}:</span> {program.ageGroup}</p>
              <p> <span className='p-lable'>{t('location')}:</span> {program.location}</p>
              <p> <span className='p-lable'> {t('duration')}: </span> {program.duration}</p>
              <p> <span className='p-lable'>{t('schedule')}:</span> {program.schedule}</p>
              <Link to={`/locator/details/${program._id}`} className="view-details">{t('view_details')}</Link>
            </div>
          ))
        ) : (
          <p className="p-not-found">*{t('no_programs_available')}</p>
        )}
      </div>


    </div>
  );
}

export default LocatorSearch;