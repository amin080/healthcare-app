import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' 
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if(!formData.name || !formData.email || !formData.password) {
        return alert("Please fill all fields");
    }

    try {
      await axios.post('http://localhost:3001/api/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="center-layout" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      <div className="card login-card">
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '2rem' }}>Join KayanHealth</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--gray)' }}>Create your account</p>
        
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" placeholder="John Doe" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input name="email" placeholder="name@email.com" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Create a password" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>I am a:</label>
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="finance">Finance Manager</option>
          </select>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={handleRegister}>
          Sign Up
        </button>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;