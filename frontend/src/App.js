import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import StudentSignup from './Components/Signup/StudentSignup';
import CompanySignup from './Components/Signup/CompanySignup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup/student" element={<StudentSignup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
