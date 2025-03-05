const express = require('express');
const router = express.Router();
const passageCalculatorController = require('../controllers/passageCalculatorController');

router.post('/', passageCalculatorController.calculatePassage);

module.exports = router;
