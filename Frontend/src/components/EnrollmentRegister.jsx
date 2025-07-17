import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/enrollment.css';

function EnrollmentRegister() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]); // multiple
  const [formData, setFormData] = useState({
    childName: '', age: '', parentName: '', email: '',
    emergencyContact: '', gender: '', primaryLanguage: '',
    familyIncome: '', householdVehicle: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/programs', { params: { lang: i18n.language } })
      .then(res => setPrograms(res.data))
      .catch(err => console.log(err));
  }, [i18n.language]);

  const handleCheckboxChange = (programId) => {
    setSelectedPrograms(prev =>
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const wrapMultiLang = (value) => ({
    en: i18n.language === 'en' ? value : '',
    es: i18n.language === 'es' ? value : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPrograms.length === 0) {
      setError(t('please_select_program'));
      return;
    }

    const payload = {
      programIds: selectedPrograms,
      childName: wrapMultiLang(formData.childName),
      age: formData.age,
      parentName: wrapMultiLang(formData.parentName),
      email: formData.email,
      emergencyContact: wrapMultiLang(formData.emergencyContact),
      gender: wrapMultiLang(formData.gender),
      primaryLanguage: wrapMultiLang(formData.primaryLanguage),
      familyIncome: wrapMultiLang(formData.familyIncome),
      householdVehicle: wrapMultiLang(formData.householdVehicle)
    };

    axios.post('http://localhost:5000/api/register', payload)
      .then(res => {
          // load existing IDs
          const existing = JSON.parse(localStorage.getItem('registrationIds') || '[]');
          // add new _id
          const updated = [...existing, res.data._id];
          localStorage.setItem('registrationIds', JSON.stringify(updated));
          navigate('/enrollment/status');
        })
      .catch(err => {
        console.log(err);
        setError(t('registration_failed'));
      });
  };

  return (
    <div className="enrollment-container">
      <div className="header">
        <span>Logo</span>
        <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
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
              type="checkbox"
              checked={selectedPrograms.includes(program._id)}
              onChange={() => handleCheckboxChange(program._id)}
            /> {program.name}
          </label>
        ))}
        {programs.length === 0 && <p>{t('loading')}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="step">
        <h4>{t('your_information')}</h4>
        <form onSubmit={handleSubmit}>
          <input name="childName" placeholder={t('child_name')} onChange={handleChange} className="input-field" />
          <input name="age" placeholder={t('age')} onChange={handleChange} className="input-field" />
          <input name="parentName" placeholder={t('parent_name')} onChange={handleChange} className="input-field" />
          <input type="email" name="email" placeholder={t('parent_email')} onChange={handleChange} className="input-field" />
          <input name="emergencyContact" placeholder={t('emergency_contact')} onChange={handleChange} className="input-field" />
          <input name="primaryLanguage" placeholder={t('primary_language')} onChange={handleChange} className="input-field" />
          <input name="familyIncome" placeholder={t('family_income')} onChange={handleChange} className="input-field" />
          <input name="gender" placeholder={t('gender')} onChange={handleChange} className="input-field" />
          <input name="householdVehicle" placeholder={t('household_vehicle')} onChange={handleChange} className="input-field" />
          <button type="submit" className="submit-btn">{t('submit')}</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default EnrollmentRegister;
