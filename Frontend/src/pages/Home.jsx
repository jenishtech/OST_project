import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zip.trim()) {
      localStorage.setItem('zip', zip.trim());
      navigate('/locator');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>Enter your ZIP code to find programs</h2>
        <form onSubmit={handleSubmit} className="zip-form">
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 12345"
            className="zip-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
