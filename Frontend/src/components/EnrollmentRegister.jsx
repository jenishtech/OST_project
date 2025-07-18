import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/enrollment.css";

const API = import.meta.env.VITE_API_URL;

function EnrollmentRegister() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState([]);
  const [formData, setFormData] = useState({
    childName: "",
    age: "",
    parentName: "",
    email: "",
    emergencyContact: "",
    gender: "",
    primaryLanguage: "",
    familyIncome: "",
    householdVehicle: "",
  });
  const [error, setError] = useState("");

  const zip = localStorage.getItem('zip') || '';

  useEffect(() => {
    // Fetch programs
    axios
      .get(`${API}/programs`, { params: { lang: i18n.language, zip } })
      .then((res) => setPrograms(res.data))
      .catch((err) => console.log(err));

    // Load already registered IDs first
    const regIds = JSON.parse(localStorage.getItem("registrationIds") || "[]");

    if (regIds.length > 0) {
      Promise.all(
        regIds.map((id) =>
          axios
            .get(`${API}/status/${id}`, { params: { lang: i18n.language } })
            .then((res) => res.data)
            .catch(() => null)
        )
      ).then((results) => {
        const valid = results.filter(Boolean);
        const allProgramIds = valid.flatMap((reg) =>
          reg.programs.map((p) => p.programId._id)
        );
        setAlreadyRegistered(allProgramIds);

        // After loading already registered, check if we got programId from location
        const programId = location.state?.programId;
        if (programId && !allProgramIds.includes(programId)) {
          // Only add if not already registered
          setSelectedPrograms((prev) =>
            prev.includes(programId) ? prev : [...prev, programId]
          );
        }
      });
    } else {
      // no registered programs yet
      const programId = location.state?.programId;
      if (programId) {
        setSelectedPrograms((prev) =>
          prev.includes(programId) ? prev : [...prev, programId]
        );
      }
    }
  }, [i18n.language, location.state]); // do not depend on alreadyRegistered here

  const handleCheckboxChange = (programId) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const wrapMultiLang = (value) => ({
    en: i18n.language === "en" ? value : "",
    es: i18n.language === "es" ? value : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPrograms.length === 0) {
      setError(t("please_select_program"));
      return;
    }

    const uniqueProgramIds = [...new Set(selectedPrograms)];

    const payload = {
      programIds: uniqueProgramIds,
      childName: wrapMultiLang(formData.childName),
      age: formData.age,
      parentName: wrapMultiLang(formData.parentName),
      email: formData.email,
      emergencyContact: wrapMultiLang(formData.emergencyContact),
      gender: wrapMultiLang(formData.gender),
      primaryLanguage: wrapMultiLang(formData.primaryLanguage),
      familyIncome: wrapMultiLang(formData.familyIncome),
      householdVehicle: wrapMultiLang(formData.householdVehicle),
    };

    axios
      .post(`${API}/register`, payload)
      .then((res) => {
        const existing = JSON.parse(localStorage.getItem("registrationIds") || "[]");
        const updated = [...new Set([...existing, res.data._id])];
        localStorage.setItem("registrationIds", JSON.stringify(updated));
        navigate("/enrollment/status");
      })
      .catch((err) => {
        console.log(err);
        setError(t("registration_failed"));
      });
  };

  return (
    <div className="enrollment-container">
      {/* header */}
      <div className="header">
        <span>Logo</span>
        <div className="header-right">
          <button className="status-btn" onClick={() => navigate("/enrollment/status")}>
            {t("view_status")}
          </button>
          <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>

      <h3>{t("register_programs")}</h3>

      {/* Step: select programs */}
      <div className="step">
        <h4>{t("select_programs")}</h4>
        {programs.length > 0 ? (
          programs.map((program) => (
            <label key={program._id} style={{ display: "block", marginBottom: "4px" }}>
              <input
                type="checkbox"
                checked={selectedPrograms.includes(program._id)}
                disabled={alreadyRegistered.includes(program._id)}
                onChange={() => handleCheckboxChange(program._id)}
              />{" "}
              {program.name}
              {alreadyRegistered.includes(program._id) && (
                <span style={{ color: "gray", marginLeft: "4px" }}>
                  ({t("already_registered")})
                </span>
              )}
            </label>
          ))
        ) : (
          <p className="p-not-found">*{t("no_programs_available")}</p>
        )}
        {error && <p style={{ color: "red" }} className="error">*{error}</p>}
      </div>

      {/* Step: user info */}
      <div className="step">
        <h4>{t("your_information")}</h4>
        <form onSubmit={handleSubmit}>
          <input name="childName" placeholder={t("child_name")} onChange={handleChange} className="input-field" />
          <input name="age" placeholder={t("age")} onChange={handleChange} className="input-field" />
          <input name="parentName" placeholder={t("parent_name")} onChange={handleChange} className="input-field" />
          <input type="email" name="email" placeholder={t("parent_email")} onChange={handleChange} className="input-field" />
          <input name="emergencyContact" placeholder={t("emergency_contact")} onChange={handleChange} className="input-field" />
          <input name="primaryLanguage" placeholder={t("primary_language")} onChange={handleChange} className="input-field" />
          <input name="familyIncome" placeholder={t("family_income")} onChange={handleChange} className="input-field" />
          <input name="householdVehicle" placeholder={t("household_vehicle")} onChange={handleChange} className="input-field" />
          <select name="gender" onChange={handleChange} value={formData.gender} className="gender-select">
            <option value="">{t("gender")}</option>
            <option value="Male">{t("male")}</option>
            <option value="Female">{t("female")}</option>
          </select>
          <br />
          <button type="submit" className="submit-btn">{t("submit")}</button>
        </form>
      </div>
    </div>
  );
}

export default EnrollmentRegister;
