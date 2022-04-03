const express = require('express');
const router = express.Router();
const { jwtChecker } = require('../auth/jwt-checker');
const { createOrder, getOrderById, updateOrderStatus } = require('../controllers/order');

router.post('/orders', jwtChecker, createOrder);

router.param('id', getOrderById);

router.put('/orders/:id', jwtChecker, updateOrderStatus);

module.exports = router;
