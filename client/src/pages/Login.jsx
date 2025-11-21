import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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
    <div className="center-layout">
      <div className="card login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Kayan Healthcare" style={{ height: '60px', marginBottom: '1rem' }} />
          <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome Back
          </h1>
          <p style={{ marginBottom: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Sign in to access your healthcare dashboard
          </p>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleLogin}>
          🔐 Sign In
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;