import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/locator.css";

function LocatorSearch() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({
    age: "",
    location: "",
    schedule: "",
    search: "",
  });
  const [uniqueFilters, setUniqueFilters] = useState({
    ageGroups: [],
    locations: [],
    schedules: [],
  });

  useEffect(() => {
    const zip = localStorage.getItem("zip");
    if (!zip) {
      navigate("/"); // if no zip, redirect home
      return;
    }

    // fetch filter dropdowns filtered by zip
    axios
      .get("http://localhost:5000/api/programs-filters", {
        params: { lang: i18n.language, zip },
      })
      .then((res) => setUniqueFilters(res.data))
      .catch((err) => console.error(err));

    // fetch programs filtered by zip + other filters
    axios
      .get("http://localhost:5000/api/programs", {
        params: { ...filters, lang: i18n.language, zip },
      })
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error(err));
  }, [filters, i18n.language, navigate]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const handleSearchChange = (e) => {
  setFilters({ ...filters, search: e.target.value.trimStart() }); // prevent space at front while typing
};

  return (
    <div className="locator-container">
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

      <h2>{t("find_programs")}</h2>

      <input
        type="text"
        name="search"
        placeholder={t("search_placeholder")}
        className="search-bar"
        value={filters.search}
        onChange={handleSearchChange}
      />

      <div className="filters">
        <select
          name="age"
          onChange={handleFilterChange}
          value={filters.age}
          className="filter"
        >
          <option value="">{t("age")}</option>
          {uniqueFilters.ageGroups.map((age, i) => (
            <option key={i} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select
          name="location"
          onChange={handleFilterChange}
          value={filters.location}
          className="filter"
        >
          <option value="">{t("location")}</option>
          {uniqueFilters.locations.map((loc, i) => (
            <option key={i} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          name="schedule"
          onChange={handleFilterChange}
          value={filters.schedule}
          className="filter"
        >
          <option value="">{t("schedule")}</option>
          {uniqueFilters.schedules.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="program-list">
        {programs.length > 0 ? (
          programs.map((p) => (
            <div key={p._id} className="program-card">
              <h3>{p.name}</h3>
              <p>
                <strong>{t("location")}:</strong> {p.location}
              </p>
              <p>
                <strong>{t("age_group")}:</strong> {p.ageGroup}
              </p>
              <p>
                <strong>{t("duration")}:</strong> {p.duration}
              </p>
              <p>
                <strong>{t("schedule")}:</strong> {p.schedule}
              </p>
              <Link to={`/locator/details/${p._id}`} className="view-details">
                {t("view_details")}
              </Link>
            </div>
          ))
        ) : (
          <p className="p-not-found">*{t("no_programs_available")}</p>
        )}
      </div>
    </div>
  );
}

export default LocatorSearch;
