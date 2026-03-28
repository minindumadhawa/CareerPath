import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import StudentSignup from './Components/Signup/StudentSignup';
import CompanySignup from './Components/Signup/CompanySignup';
import Login from './Components/Login/Login';
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import CompanyDashboard from './Components/Dashboard/CompanyDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import StudentProfileResume from './Components/Dashboard/StudentProfileResume';
import ResumeTemplates from './Components/Dashboard/ResumeTemplates';
import CVPreview from './Components/Dashboard/CVPreview';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-profile-resume" element={<StudentProfileResume />} />
          <Route path="/resume-templates" element={<ResumeTemplates />} />
          <Route path="/cv-preview" element={<CVPreview />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
