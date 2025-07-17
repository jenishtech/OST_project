import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/enrollment.css";

function EnrollmentStatus() {
  const { t, i18n } = useTranslation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("registrationIds") || "[]");
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        axios
          .get(`http://localhost:5000/api/status/${id}`, {
            params: { lang: i18n.language },
          })
          .then((res) => ({ id, data: res.data }))
          .catch((err) => {
            console.log(`Registration not found or error for ID ${id}:`, err);
            return null; // Mark as failed
          })
      )
    ).then((results) => {
      const valid = results.filter(Boolean);
      setRegistrations(valid.map((item) => item.data));

      // Clean localStorage to keep only valid IDs
      const validIds = valid.map((item) => item.id);
      localStorage.setItem("registrationIds", JSON.stringify(validIds));

      setLoading(false);
    });
  }, []); // Empty dependency → run only once on mount

  const getField = (field) =>
    field && typeof field === "object"
      ? field[i18n.language] || field.en || ""
      : field || "";

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="enrollment-container">
      <div className="header">
        <span>Logo</span>
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>
      <h3>{t("status")}</h3>
      <ul>
        {registrations.length > 0 ? (
          registrations.map((registration, idx) =>
            registration.programs.map((p) => (
              <li key={p.programId._id + idx}>
                {p.status === "Confirmed" && "✅"}
                {p.status === "Waitlisted" && "⚠️"}
                {p.status === "Rejected" && "❌"}
                {getField(p.programId?.name)} — {p.status}
              </li>
            ))
          )
        ) : (
          <li>{t("no_registrations_found")}</li>
        )}
      </ul>

      <p className="note">*{t("status_note")}</p>
      <Link to="/enrollment" className="back-btn">
        {t("back_to_programs")}
      </Link>
    </div>
  );
}

export default EnrollmentStatus;
