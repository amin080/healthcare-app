const express = require('express');
const router = express.Router();
const { searchVisits, getFinanceDashboard } = require('../controllers/financeController');

router.get('/search', searchVisits);
router.get('/dashboard', getFinanceDashboard);

module.exports = router;