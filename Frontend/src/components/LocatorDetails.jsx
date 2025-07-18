import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/locator.css';

const API = import.meta.env.VITE_API_URL;
// console.log("API URL LD:", API); // Check if the API URL is set correctly

function LocatorDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    axios.get(`${API}/programs/${id}`, { params: { lang: i18n.language } })
      .then(res => {
        if (res.data) {
          setProgram(res.data);
        } else {
          setProgram(false);
        }
      })
      .catch(err => {
        console.log(err);
        setProgram(false);
      });
  }, [id, i18n.language]);

  if (program === null) return <div>{t('loading')}</div>;
  if (program === false) return <p className="p-not-found">*{t('no_programs_available')}</p>;

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
      <p> <span className='dl-span'>{t('description')}: </span> {program.description}</p>
      <p> <span className='dl-span'>{t('age_group')}: </span> {program.ageGroup}</p>
      <p> <span className='dl-span'>{t('location')}:</span> {program.location}</p>
      <p> <span className='dl-span'>{t('duration')}: </span> {program.duration}</p>
      <p> <span className='dl-span'>{t('schedule')}:</span> {program.schedule}</p>
      <p> <span className='dl-span'>{t('eligibility')}:</span> {program.eligibility}</p>
      <p> <span className='dl-span'>{t('contact')}:</span> {program.contact}</p>
      <Link to="/enrollment" state={{ programId: id }} className="register-btn">{t('register_now')}</Link>
      <Link to="/locator" className="back-btn">{t('back_to_search')}</Link>
    </div>
  );
}

export default LocatorDetails;