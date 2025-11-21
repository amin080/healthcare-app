import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', { email, password });
      
      localStorage.setItem('user', JSON.stringify(res.data));

      if (res.data.role === 'patient') navigate('/patient');
      if (res.data.role === 'doctor') navigate('/doctor');
      if (res.data.role === 'finance') navigate('/finance');
      if (res.data.role === 'admin') navigate('/admin');

    } catch (err) {
      alert('Invalid Credentials');
    }
  };

 return (
    <div className="center-layout" >
      <div className="card login-card">
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '2rem' }}>KayanHealth</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--gray)' }}>Welcome back, please login.</p>
        
        <div className="form-group">
          <label>Email Address</label>
          <input placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
          Login
        </button>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register here</Link>
        </div>
      </div>
    </div>
  );


}

export default Login;