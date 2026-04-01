import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { StudentProvider } from '../../context/CareerAdviceModule/StudentContext';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Chatbot from './Student/Chatbot';

import '../../Appp.css';
import '../../indexx.css';

const CareerAdviceLayout = () => {
  const location = useLocation();
  const isStudent = location.pathname.startsWith('/student');

  return (
    <StudentProvider>
      <div className="app-wrapper">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="content-area">
            <Outlet />
            {isStudent && <Chatbot />}
          </div>
        </div>
      </div>
    </StudentProvider>
  );
};

export default CareerAdviceLayout;
