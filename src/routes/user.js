const express = require('express');
const router = express.Router();
const {
	createUser,
	fetchById,
	getUserById,
	updateAddress,
	getUserAddress,
} = require('../controllers/user');
const { jwtChecker } = require('../auth/jwt-checker');

router.post('/users', jwtChecker, createUser);

router.param('id', fetchById);

router.get('/users/:id', jwtChecker, getUserById);

router.put('/users/:id/address', jwtChecker, updateAddress);

router.get('/users/:id/address', jwtChecker, getUserAddress);

module.exports = router;
