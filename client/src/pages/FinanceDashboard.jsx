import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FinanceDashboard() {
  const [results, setResults] = useState([]);
  const [docName, setDocName] = useState('');
  const [patName, setPatName] = useState('');
  const [visitId, setVisitId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    const res = await axios.get('http://localhost:3001/api/finance/search', {
      params: {
        doctorName: docName,
        patientName: patName,
        visitId: visitId
      }
    });
    setResults(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

   return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Finance Overview</h1>
        <button className="btn-outline" onClick={handleLogout}>Logout</button>
      </header>

      
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--gray)' }}>Filter Records</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          
          <div className="form-group" style={{marginBottom: 0}}>
            <label>Doctor Name</label>
            <input placeholder="e.g. Smith" onChange={e => setDocName(e.target.value)} />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Patient Name</label>
            <input placeholder="e.g. John" onChange={e => setPatName(e.target.value)} />
          </div>

          <div className="form-group" style={{marginBottom: 0}}>
            <label>Visit ID</label>
            <input placeholder="ID #" onChange={e => setVisitId(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={handleSearch}>
            Search Records
          </button>
        </div>
      </div>

      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No records found.</td></tr>
            ) : (
              results.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>Dr. {r.doctor_name}</td>
                  <td>{r.patient_name}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '1.1rem' }}>
                    ${r.total_amount}
                  </td>
                  <td>
                    <span className={`status-badge status-${r.status}`}>{r.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinanceDashboard;