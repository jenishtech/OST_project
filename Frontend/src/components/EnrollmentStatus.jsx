import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/enrollment.css';

function EnrollmentStatus() {
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (state?.registrationId) {
      axios.get(`http://localhost:5000/api/status/${state.registrationId}`, {
        params: { lang: i18n.language }
      })
        .then(res => setRegistration(res.data))
        .catch(err => console.log(err));
    }
  }, [state, i18n.language]);

  if (!registration) return <div>{t('loading')}</div>;

  const getField = (field) => {
    if (field && typeof field === 'object') {
      return field[i18n.language] || field.en || '';
    }
    return field || '';
  };

  const statusMap = {
    Confirmed: t('confirmed') || 'Confirmed',
    Waitlisted: t('waitlisted') || 'Waitlisted',
    Rejected: t('rejected') || 'Rejected'
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
      <h3>{t('status')}</h3>
      <p className={`status-${registration.status.toLowerCase()}`}>
        {registration.status === 'Confirmed' && '✅'} {registration.status === 'Waitlisted' && '⚠️'} {registration.status === 'Rejected' && '❌'}
        {t('registration_message', {
          childName: getField(registration.childName),
          status: statusMap[registration.status]
        })}
      </p>
      <p className="note">*{t('status_note')}</p>
      <Link to="/enrollment" className="back-btn">{t('back_to_programs')}</Link>
    </div>
  );
}

export default EnrollmentStatus;


