const express = require('express');
const router = express.Router();
const { fulfillOrder } = require('../controllers/payment');

router.post('/payments/webhook', fulfillOrder);

module.exports = router;
