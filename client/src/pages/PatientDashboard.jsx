import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:3001/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

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

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
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
      </div>
    </Layout>
  );
}

export default PatientDashboard;