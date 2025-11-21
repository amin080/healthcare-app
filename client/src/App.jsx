import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register  from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import FinanceDashboard from './pages/FinanceDashboard';


import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;