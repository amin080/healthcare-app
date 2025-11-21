import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FinanceDashboard() {
  const [results, setResults] = useState([]);
  const [docName, setDocName] = useState('');
  const [patName, setPatName] = useState('');
  const [visitId, setVisitId] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    handleSearch();
    loadDashboard();
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

  const loadDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/finance/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate statistics from search results
  const totalRevenue = results.reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
  const completedVisits = results.filter(r => r.status === 'completed').length;
  const pendingVisits = results.filter(r => r.status !== 'completed').length;
  const averageTransaction = results.length > 0 ? totalRevenue / results.length : 0;

  // Chart colors
  const COLORS = ['#1e40af', '#059669', '#f59e0b', '#dc2626'];

  // Prepare pie chart data
  const pieData = dashboardData ? dashboardData.visitsByStatus.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count
  })) : [];

  // Prepare line chart data
  const lineData = dashboardData ? dashboardData.revenueTrend.map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(item.revenue || 0),
    visits: item.count
  })) : [];

  return (
    <Layout userRole="finance" userName={user?.name || 'Finance User'}>
      <div className="page-header">
        <h1>Financial Overview</h1>
        <p>Track and manage all financial transactions</p>
      </div>

      {/* Overall Statistics Cards */}
      {dashboardData && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon primary">💰</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${parseFloat(dashboardData.revenue.total || 0).toFixed(2)}</div>
            <div className="stat-change positive">↗ All time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">📈</div>
            <div className="stat-label">This Month</div>
            <div className="stat-value">${parseFloat(dashboardData.revenue.month || 0).toFixed(2)}</div>
            <div className="stat-change positive">{dashboardData.revenue.monthCount} visits</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accent">📅</div>
            <div className="stat-label">This Week</div>
            <div className="stat-value">${parseFloat(dashboardData.revenue.week || 0).toFixed(2)}</div>
            <div className="stat-change">{dashboardData.revenue.weekCount} visits</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon primary">📊</div>
            <div className="stat-label">Avg Transaction</div>
            <div className="stat-value">${parseFloat(dashboardData.revenue.average || 0).toFixed(2)}</div>
            <div className="stat-change">Per visit</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {dashboardData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Revenue Trend Chart */}
          <div className="card">
            <div className="card-header">
              <h3>📈 Revenue Trend (Last 7 Days)</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} name="Revenue ($)" />
                  <Line type="monotone" dataKey="visits" stroke="#1e40af" strokeWidth={2} name="Visits" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visits by Status Pie Chart */}
          <div className="card">
            <div className="card-header">
              <h3>📊 Visits by Status</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Top Performing Doctors */}
      {dashboardData && dashboardData.topDoctors.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>🏆 Top Performing Doctors</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Total Revenue</th>
                  <th>Visits</th>
                  <th>Avg per Visit</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.topDoctors.map((doc, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>Dr. {doc.doctor_name}</td>
                    <td style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                      ${parseFloat(doc.total_revenue || 0).toFixed(2)}
                    </td>
                    <td>{doc.visit_count} visits</td>
                    <td>${(doc.total_revenue / doc.visit_count).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Search Results Statistics */}
      {results.length > 0 && (
        <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon accent">💵</div>
            <div className="stat-label">Search Revenue</div>
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-change">From filtered results</div>
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
      )}

      {/* Transactions Table */}
      <div className="table-container" style={{ marginTop: '2rem' }}>
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