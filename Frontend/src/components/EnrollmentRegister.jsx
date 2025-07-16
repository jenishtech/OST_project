import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/enrollment.css';

function EnrollmentRegister() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    programId: '',
    childName: '',
    age: '',
    parentName: '',
    email: '',
    emergencyContact: '',
    gender: '',
    primaryLanguage: '',
    familyIncome: '',
    householdVehicle: ''
  });
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/programs', { params: { lang: i18n.language } })
      .then(res => setPrograms(res.data))
      .catch(err => console.log(err));
  }, [i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'programId' && value) setError(''); // Clear error if program is selected
  };

  // Helper to wrap multilanguage fields
  const wrapMultiLang = (value) => ({
    en: i18n.language === 'en' ? value : '',
    es: i18n.language === 'es' ? value : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.programId) {
      setError(t('please_select_program'));
      return;
    }
    const payload = {
      ...formData,
      childName: wrapMultiLang(formData.childName),
      parentName: wrapMultiLang(formData.parentName),
      emergencyContact: wrapMultiLang(formData.emergencyContact),
      gender: wrapMultiLang(formData.gender),
      primaryLanguage: wrapMultiLang(formData.primaryLanguage),
      familyIncome: wrapMultiLang(formData.familyIncome),
      householdVehicle: wrapMultiLang(formData.householdVehicle)
    };
    axios.post('http://localhost:5000/api/register', payload)
      .then(res => navigate('/enrollment/status', { state: { registrationId: res.data._id } }))
      .catch(err => {
        console.log(err);
        setError(t('registration_failed'));
      });
  };

  return (
    <div className="enrollment-container">
      <div className="header">
        <span>Logo</span>
        <select className="language" onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>
      <h3>{t('register_programs')}</h3>
      <div className="step">
        <h4>{t('select_programs')}</h4>
        {programs.map(program => (
          <label key={program._id}>
            <input
              type="radio"
              name="programId"
              value={program._id}
              checked={formData.programId === program._id}
              onChange={handleChange}
            /> {program.name}
          </label>
        ))}
        {programs.length === 0 && <p>{t('loading')}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="step">
        <h4>{t('your_information')}</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="childName" placeholder={t('child_name')} onChange={handleChange} className="input-field" />
          <input type="text" name="age" placeholder={t('age')} onChange={handleChange} className="input-field" />
          <input type="text" name="parentName" placeholder={t('parent_name')} onChange={handleChange} className="input-field" />
          <input type="email" name="email" placeholder={t('parent_email')} onChange={handleChange} className="input-field" />
          <input type="text" name="emergencyContact" placeholder={t('emergency_contact')} onChange={handleChange} className="input-field" />
          <select name="gender" onChange={handleChange} className="input-field">
            <option value="">{t('gender')}</option>
            <option value="Male">{t('gender') === 'Gender' ? 'Male' : 'Masculino'}</option>
            <option value="Female">{t('gender') === 'Gender' ? 'Female' : 'Femenino'}</option>
          </select>
          <input type="text" name="primaryLanguage" placeholder={t('primary_language')} onChange={handleChange} className="input-field" />
          <input type="text" name="familyIncome" placeholder={t('family_income')} onChange={handleChange} className="input-field" />
          <select name="householdVehicle" onChange={handleChange} className="input-field">
            <option value="">{t('household_vehicle')}</option>
            <option value="Yes">{t('household_vehicle') === 'Household Vehicle' ? 'Yes' : 'Sí'}</option>
            <option value="No">{t('household_vehicle') === 'Household Vehicle' ? 'No' : 'No'}</option>
          </select>
          <button type="submit" className="submit-btn">{t('submit')}</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default EnrollmentRegister;