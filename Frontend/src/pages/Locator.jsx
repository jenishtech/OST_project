import { Route, Routes, Link } from 'react-router-dom';
import LocatorSearch from '../components/LocatorSearch';
import LocatorDetails from '../components/LocatorDetails';

function Locator() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LocatorSearch />} />
        <Route path="details/:id" element={<LocatorDetails />} />
      </Routes>
    </div>
  );
}

export default Locator;