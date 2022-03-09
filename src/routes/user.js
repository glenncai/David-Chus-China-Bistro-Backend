const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/user');
const { jwtChecker } = require('../auth/jwt-checker');

router.post('/users', jwtChecker, createUser);

module.exports = router;
