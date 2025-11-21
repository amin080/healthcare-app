import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
  const [visits, setVisits] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null); 
  
  const [treatments, setTreatments] = useState([]);
  const [tName, setTName] = useState('');
  const [tPrice, setTPrice] = useState(0);
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

 return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Dr.{user?.name}'s Dashboard</h1>
        <button className="btn-outline" onClick={handleLogout}>Logout</button>
      </header>

      {activeVisit ? (
       
        <div className="card" style={{ borderTop: '5px solid var(--secondary)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Active Visit (ID: {activeVisit})</h2>
          
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

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                {treatments.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', padding: '5px 0' }}>
                    <span>{t.name}</span>
                    <strong>${t.price}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  <span>Total:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button className="btn-success" onClick={completeVisit}>Complete Visit & Save</button>
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
              {visits.map(v => (
                <tr key={v.id}>
                  <td>{new Date(v.date).toLocaleString()}</td>
                  <td>{v.patient_name}</td>
                  <td>
                    <span className={`status-badge status-${v.status}`}>{v.status}</span>
                  </td>
                  <td>
                    {v.status === 'booked' && (
                      <button className="btn-primary" onClick={() => startVisit(v.id)}>Start Visit</button>
                    )}
                    {v.status === 'in_progress' && (
                      <button className="btn-success" onClick={() => setActiveVisit(v.id)}>Resume</button>
                    )}
                    {v.status === 'completed' && <span style={{color: 'var(--gray)'}}>Closed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;