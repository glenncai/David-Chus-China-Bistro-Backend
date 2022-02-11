const express = require('express');
const router = express.Router();
const {
	createDish,
	fetchDishes,
	fetchDishId,
	fetchDishById,
	fetchDishPhoto,
} = require('../controllers/dish');

router.post('/dishes', createDish);

router.get('/dishes', fetchDishes);

router.param('id', fetchDishId);

router.get('/dishes/:id', fetchDishById);

router.get('/dishes/:id/photo', fetchDishPhoto);

module.exports = router;
