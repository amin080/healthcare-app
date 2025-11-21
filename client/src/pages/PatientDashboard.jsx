import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

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
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
          alert("Error: " + err.response.data.message);
      } else {
          alert("Error booking visit");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="center-layout">
      
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
         <h2 style={{fontWeight: 800}}>Hello, {user?.name}</h2>
         <button className="btn-outline" style={{padding: '0.5rem 1rem'}} onClick={handleLogout}>Logout</button>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          Book an Appointment
        </h2>
        
        <div className="form-group">
          <label>Select Doctor</label>
          <select onChange={(e) => setSelectedDoctor(e.target.value)}>
            <option value="">-- Choose a Specialist --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Date & Time</label>
          <input type="datetime-local" onChange={(e) => setDate(e.target.value)} />
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleBook}>
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}

export default PatientDashboard;