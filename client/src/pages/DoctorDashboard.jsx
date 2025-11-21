import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function DoctorDashboard() {
  const [visits, setVisits] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null);

  const [treatments, setTreatments] = useState([]);
  const [tName, setTName] = useState('');
  const [tPrice, setTPrice] = useState(0);
  const [notes, setNotes] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = () => {
    axios.get(`http://localhost:3001/api/visits/doctor/${user.id}`)
      .then(res => setVisits(res.data));
  };

  const startVisit = async (visitId) => {
    try {
      await axios.put(`http://localhost:3001/api/visits/start/${visitId}`, { doctorId: user.id });
      setActiveVisit(visitId);
      alert("Visit Started");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const addTreatment = () => {
    setTreatments([...treatments, { name: tName, price: parseFloat(tPrice) }]);
    setTName('');
    setTPrice(0);
  };

  const totalAmount = treatments.reduce((sum, item) => sum + item.price, 0);

  const completeVisit = async () => {
    await axios.post('http://localhost:3001/api/visits/complete', {
      visitId: activeVisit,
      treatments,
      totalAmount,
      notes
    });
    alert("Visit Completed!");
    setActiveVisit(null);
    setTreatments([]);
    loadVisits();
  };

  // Calculate statistics
  const bookedVisits = visits.filter(v => v.status === 'booked').length;
  const inProgressVisits = visits.filter(v => v.status === 'in_progress').length;
  const completedVisits = visits.filter(v => v.status === 'completed').length;

  return (
    <Layout userRole="doctor" userName={user?.name || 'Doctor'}>
      {!activeVisit && (
        <>
          <div className="page-header">
            <h1>Doctor's Dashboard</h1>
            <p>Manage patient visits and medical records</p>
          </div>

          {/* Statistics Cards */}
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon primary">📅</div>
              <div className="stat-label">Booked</div>
              <div className="stat-value">{bookedVisits}</div>
              <div className="stat-change">Upcoming visits</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon accent">⏱️</div>
              <div className="stat-label">In Progress</div>
              <div className="stat-value">{inProgressVisits}</div>
              <div className="stat-change">Active now</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon secondary">✅</div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completedVisits}</div>
              <div className="stat-change">All time</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon primary">📊</div>
              <div className="stat-label">Total Visits</div>
              <div className="stat-value">{visits.length}</div>
              <div className="stat-change">Overall</div>
            </div>
          </div>
        </>
      )}

      {activeVisit ? (
        <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
          <div className="card-header">
            <h3>Active Visit (ID: {activeVisit})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div className="form-group">
                <label>Medical Notes</label>
                <textarea rows="5" onChange={(e) => setNotes(e.target.value)} placeholder="Type findings here..."></textarea>
              </div>
            </div>

            <div>
              <label>Add Treatment</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <input placeholder="Treatment Name" value={tName} onChange={e => setTName(e.target.value)} />
                <input type="number" placeholder="$ Price" style={{ width: '100px' }} value={tPrice} onChange={e => setTPrice(e.target.value)} />
                <button className="btn-primary" onClick={addTreatment}>+</button>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {treatments.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', padding: '8px 0' }}>
                    <span>{t.name}</span>
                    <strong>${t.price.toFixed(2)}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button className="btn-success" onClick={completeVisit}>✓ Complete Visit & Save</button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No visits scheduled yet.
                </td></tr>
              ) : (
                visits.map(v => (
                  <tr key={v.id}>
                    <td>{new Date(v.date).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{v.patient_name}</td>
                    <td>
                      <span className={`status-badge status-${v.status}`}>{v.status}</span>
                    </td>
                    <td>
                      {v.status === 'booked' && (
                        <button className="btn-primary" onClick={() => startVisit(v.id)}>▶ Start Visit</button>
                      )}
                      {v.status === 'in_progress' && (
                        <button className="btn-success" onClick={() => setActiveVisit(v.id)}>↻ Resume</button>
                      )}
                      {v.status === 'completed' && <span style={{ color: 'var(--text-secondary)' }}>Closed</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default DoctorDashboard;