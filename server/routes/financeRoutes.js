const express = require('express');
const router = express.Router();
const { searchVisits } = require('../controllers/financeController');

router.get('/search', searchVisits);

module.exports = router;