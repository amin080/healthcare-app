import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function FinanceDashboard() {
  const [results, setResults] = useState([]);
  const [docName, setDocName] = useState('');
  const [patName, setPatName] = useState('');
  const [visitId, setVisitId] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

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

  // Calculate statistics
  const totalRevenue = results.reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
  const completedVisits = results.filter(r => r.status === 'completed').length;
  const pendingVisits = results.filter(r => r.status !== 'completed').length;
  const averageTransaction = results.length > 0 ? totalRevenue / results.length : 0;

  return (
    <Layout userRole="finance" userName={user?.name || 'Finance User'}>
      <div className="page-header">
        <h1>Financial Overview</h1>
        <p>Track and manage all financial transactions</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon primary">💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${totalRevenue.toFixed(2)}</div>
          <div className="stat-change positive">↗ All time</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">✅</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedVisits}</div>
          <div className="stat-change positive">Visits processed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accent">⏳</div>
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pendingVisits}</div>
          <div className="stat-change">Awaiting completion</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-label">Avg Transaction</div>
          <div className="stat-value">${averageTransaction.toFixed(2)}</div>
          <div className="stat-change">Per visit</div>
        </div>
      </div>

      {/* Filter Card */}
      <div className="card">
        <div className="card-header">
          <h3>Filter Records</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Doctor Name</label>
              <input placeholder="e.g. Smith" value={docName} onChange={e => setDocName(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Patient Name</label>
              <input placeholder="e.g. John" value={patName} onChange={e => setPatName(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Visit ID</label>
              <input placeholder="ID #" value={visitId} onChange={e => setVisitId(e.target.value)} />
            </div>

            <button className="btn-primary" onClick={handleSearch}>
              🔍 Search Records
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
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
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No records found. Try adjusting your filters.
              </td></tr>
            ) : (
              results.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>#{r.id}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>Dr. {r.doctor_name}</td>
                  <td>{r.patient_name}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '1.05rem' }}>
                    ${parseFloat(r.total_amount).toFixed(2)}
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
    </Layout>
  );
}

export default FinanceDashboard;