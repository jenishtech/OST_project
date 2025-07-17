import { Route, Routes, Link } from "react-router-dom";
import EnrollmentRegister from "../components/EnrollmentRegister";
import EnrollmentStatus from "../components/EnrollmentStatus";

function Enrollment() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<EnrollmentRegister />} />
        <Route path="status" element={<EnrollmentStatus />} />
      </Routes>
    </div>
  );
}

export default Enrollment;
