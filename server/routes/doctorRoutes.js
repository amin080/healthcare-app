const express = require('express');
const router = express.Router();
const { getMyVisits, startVisit, completeVisit, getDoctorDashboard } = require('../controllers/doctorController');

router.get('/visits/doctor/:id', getMyVisits);
router.put('/visits/start/:visitId', startVisit);
router.post('/visits/complete', completeVisit);
router.get('/doctor/dashboard/:id', getDoctorDashboard);

module.exports = router;