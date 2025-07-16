import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/locator.css';

function LocatorDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/programs/${id}`, { params: { lang: i18n.language } })
      .then(res => setProgram(res.data))
      .catch(err => console.log(err));
  }, [id, i18n.language]);

  if (!program) return <div>{t('loading')}</div>;

  return (
    <div className="locator-container">
      <div className="header">
        <span>Logo</span>
        <select className="language" onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>
      <h3>{program.name}</h3>
      <p>{t('description')}: {program.description}</p>
      <p>{t('age_group')}: {program.ageGroup}</p>
      <p>{t('location')}: {program.location}</p>
      <p>{t('duration')}: {program.duration}</p>
      <p>{t('schedule')}: {program.schedule}</p>
      <p>{t('eligibility')}: {program.eligibility}</p>
      <p>{t('contact')}: {program.contact}</p>
      <Link to="/enrollment" className="register-btn">{t('register_now')}</Link>
      <Link to="/locator" className="back-btn">{t('back_to_search')}</Link>
    </div>
  );
}

export default LocatorDetails;


