import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Locator from './pages/Locator';
import Enrollment from './pages/Enrollment';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locator/*" element={<Locator />} />
        <Route path="/enrollment/*" element={<Enrollment />} />
      </Routes>
    </Router>
  );
}

export default App;