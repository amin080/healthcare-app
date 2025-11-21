const express = require('express');
const router = express.Router();
const { getDoctors, bookVisit } = require('../controllers/patientController');

router.get('/doctors', getDoctors);
router.post('/visits', bookVisit);

module.exports = router;