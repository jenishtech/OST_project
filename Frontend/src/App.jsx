import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Locator from './pages/Locator';
import Enrollment from './pages/Enrollment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/locator/*" element={<Locator />} />
        <Route path="/enrollment/*" element={<Enrollment />} />
      </Routes>
    </Router>
  );
}

export default App;