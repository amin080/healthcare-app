const express = require('express');
const router = express.Router();
const { getDoctors, bookVisit, getPatientDashboard } = require('../controllers/patientController');

router.get('/doctors', getDoctors);
router.post('/visits', bookVisit);
router.get('/patient/dashboard/:id', getPatientDashboard);

module.exports = router;