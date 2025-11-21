import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
    axios.get('http://localhost:3001/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/patient/dashboard/${user.id}`);
      setDashboardData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    if (!selectedDoctor || !date) return alert("Please fill all fields");

    try {
      await axios.post('http://localhost:3001/api/visits', {
        patientId: user.id,
        doctorId: selectedDoctor,
        date: date
      });
      alert('Visit Booked Successfully!');
      setSelectedDoctor('');
      setDate('');
      loadDashboard(); // Refresh dashboard
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Error booking visit");
      }
    }
  };

  return (
    <Layout userRole="patient" userName={user?.name || 'Patient'}>
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Book appointments and manage your healthcare</p>
      </div>

      {/* Statistics Cards */}
      {dashboardData && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon primary">📅</div>
            <div className="stat-label">Upcoming Visits</div>
            <div className="stat-value">{dashboardData.stats.upcomingCount}</div>
            <div className="stat-change">Scheduled appointments</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">✅</div>
            <div className="stat-label">Completed Visits</div>
            <div className="stat-value">{dashboardData.stats.completedCount}</div>
            <div className="stat-change">All time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accent">💰</div>
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">${parseFloat(dashboardData.totalSpent || 0).toFixed(2)}</div>
            <div className="stat-change">Healthcare expenses</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon primary">👨‍⚕️</div>
            <div className="stat-label">Favorite Doctors</div>
            <div className="stat-value">{dashboardData.favoriteDoctors.length}</div>
            <div className="stat-change">Most visited</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Book Appointment Card */}
        <div className="card">
          <div className="card-header">
            <h3>📅 Book an Appointment</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Select Doctor</label>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option value="">-- Choose a Specialist --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Date & Time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleBook}
            >
              ✓ Confirm Reservation
            </button>
          </div>
        </div>

        {/* Favorite Doctors Card */}
        {dashboardData && dashboardData.favoriteDoctors.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3>⭐ Your Favorite Doctors</h3>
            </div>
            <div className="card-body">
              {dashboardData.favoriteDoctors.map((doc, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: 600 }}>Dr. {doc.doctor_name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{doc.visit_count} visits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Visits */}
      {dashboardData && dashboardData.upcomingVisits.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>📋 Upcoming Appointments</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.upcomingVisits.map(visit => (
                  <tr key={visit.id}>
                    <td>{new Date(visit.date).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>Dr. {visit.doctor_name}</td>
                    <td>
                      <span className={`status-badge status-${visit.status}`}>{visit.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visit History */}
      {dashboardData && dashboardData.pastVisits.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>🕐 Visit History</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.pastVisits.map(visit => (
                  <tr key={visit.id}>
                    <td>{new Date(visit.date).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>Dr. {visit.doctor_name}</td>
                    <td style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                      ${parseFloat(visit.total_amount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${visit.status}`}>{visit.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PatientDashboard;