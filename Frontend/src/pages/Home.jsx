import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zip) {
      localStorage.setItem('zip', zip);
      navigate('/locator');  // navigate to locator page
    }
  };

  return (
    <div className="locator-container">
      <h2>Enter your ZIP code to find programs</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter ZIP code"
          className="search-bar"
        />
        <button type="submit" className="register-btn">Search</button>
      </form>
    </div>
  );
}

export default Home;
