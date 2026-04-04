import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { StudentProvider } from '../../context/CareerAdviceModule/StudentContext';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Chatbot from './Student/Chatbot';

import '../../Appp.css';
import '../../indexx.css';

const CareerAdviceTeaser = () => {
  const navigate = useNavigate();
  return (
    <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, padding: 40, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎓</div>
        <h1 style={{ fontSize: '2.2rem', color: '#1e293b', marginBottom: 16, fontWeight: 800 }}>Unlock Your True Career Potential</h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, marginBottom: 30 }}>
          You need to be logged in to access the full <b>Career Advice Module</b>. Discover premium leadership programs, technical resources, and skill assessments tailored just for you.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
             <div style={{ background: '#e0e7ff', padding: 10, borderRadius: 12, fontSize: '1.2rem' }}>🏆</div>
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Leadership</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Exclusive programs</div>
             </div>
          </div>
          <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
             <div style={{ background: '#cffafe', padding: 10, borderRadius: 12, fontSize: '1.2rem' }}>💻</div>
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Technical</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Video resources</div>
             </div>
          </div>
          <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12, gridColumn: '1 / -1' }}>
             <div style={{ background: '#ede9fe', padding: 10, borderRadius: 12, fontSize: '1.2rem' }}>📝</div>
             <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Skill Quizzes & Benchmarking</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Test your knowledge instantly</div>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" style={{ padding: '12px 30px', fontSize: '1.05rem', borderRadius: 50, boxShadow: '0 8px 15px rgba(26,86,219,0.3)' }} onClick={() => navigate('/login')}>
            Log In Now
          </button>
          <button className="btn btn-secondary btn-lg" style={{ padding: '12px 30px', fontSize: '1.05rem', borderRadius: 50, background: 'white', border: '1px solid #cbd5e1' }} onClick={() => navigate('/signup/student')}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

const CareerAdviceLayout = () => {
  const location = useLocation();
  const isStudent = location.pathname.startsWith('/student');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check main app localStorage
    const user = localStorage.getItem('user');
    // Also check student session context if necessary
    const guestStudent = sessionStorage.getItem('careerpath_student');
    if (user || guestStudent) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location.pathname]); // Re-check on nav

  // If accessing student routes and not authenticated, show teaser
  const showTeaser = isStudent && !isAuthenticated;

  return (
    <StudentProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Navbar />
          <div className="dashboard-content" style={{ padding: '2rem', overflowY: 'auto' }}>
            {showTeaser ? (
              <CareerAdviceTeaser />
            ) : (
              <>
                <Outlet />
                {isStudent && <Chatbot />}
              </>
            )}
          </div>
        </main>
      </div>
    </StudentProvider>
  );
};

export default CareerAdviceLayout;
