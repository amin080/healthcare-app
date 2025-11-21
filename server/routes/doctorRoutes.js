const express = require('express');
const router = express.Router();
const { getMyVisits, startVisit, completeVisit } = require('../controllers/doctorController');

router.get('/visits/doctor/:id', getMyVisits);
router.put('/visits/start/:visitId', startVisit);
router.post('/visits/complete', completeVisit);

module.exports = router;