import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Components/Home/Home';
import StudentSignup from './Components/Signup/StudentSignup';
import CompanySignup from './Components/Signup/CompanySignup';
import Login from './Components/Login/Login';
// Old Dashboards
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import CompanyDashboard from './Components/Dashboard/CompanyDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import CVPreview from './Components/Dashboard/CVPreview';
import InternshipsPage from './Components/Internships/InternshipsPage';

// Career Advice Module
import CareerAdviceLayout from './Components/CareerAdviceModule/CareerAdviceLayout';

// Admin pages
import CareerAdminDashboard from './pages/CareerAdviceModule/AdminDashboard';
import AddLeadership from './Components/CareerAdviceModule/Admin/AddLeadership';
import ManageLeadership from './Components/CareerAdviceModule/Admin/ManageLeadership';
import AddTechnicalResource from './Components/CareerAdviceModule/Admin/AddTechnicalResource';
import ManageTechnical from './Components/CareerAdviceModule/Admin/ManageTechnical';
import AddQuiz from './Components/CareerAdviceModule/Admin/AddQuiz';
import ManageQuiz from './Components/CareerAdviceModule/Admin/ManageQuiz';
import QuizResults from './Components/CareerAdviceModule/Admin/QuizResults';
import EnrollmentReport from './Components/CareerAdviceModule/Admin/EnrollmentReport';

// Student pages
import CareerStudentDashboard from './pages/CareerAdviceModule/StudentDashboard';
import LeadershipPrograms from './Components/CareerAdviceModule/Student/LeadershipPrograms';
import TechnicalResources from './Components/CareerAdviceModule/Student/TechnicalResources';
import TakeQuiz from './Components/CareerAdviceModule/Student/TakeQuiz';
import QuizList from './Components/CareerAdviceModule/Student/QuizList';
import MyProgress from './Components/CareerAdviceModule/Student/MyProgress';
import WatchProgram from './Components/CareerAdviceModule/Student/WatchProgram';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Original App Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/cv-preview" element={<CVPreview />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/internships" element={<InternshipsPage />} />

          {/* New Career Advice Module Nested Routes */}
          <Route element={<CareerAdviceLayout />}>
            <Route path="/student/dashboard" element={<CareerStudentDashboard />} />
            <Route path="/student/leadership" element={<LeadershipPrograms />} />
            <Route path="/student/technical" element={<TechnicalResources />} />
            <Route path="/student/quizzes" element={<QuizList />} />
            <Route path="/student/quiz/:id" element={<TakeQuiz />} />
            <Route path="/student/progress" element={<MyProgress />} />
            <Route path="/student/watch/:id" element={<WatchProgram />} />

            <Route path="/admin/dashboard" element={<CareerAdminDashboard />} />
            <Route path="/admin/leadership/add" element={<AddLeadership />} />
            <Route path="/admin/leadership/manage" element={<ManageLeadership />} />
            <Route path="/admin/technical/add" element={<AddTechnicalResource />} />
            <Route path="/admin/technical/manage" element={<ManageTechnical />} />
            <Route path="/admin/quiz/add" element={<AddQuiz />} />
            <Route path="/admin/quiz/manage" element={<ManageQuiz />} />
            <Route path="/admin/quiz/results" element={<QuizResults />} />
            <Route path="/admin/enrollments" element={<EnrollmentReport />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      </div>
    </Router>
  );
}

export default App;
