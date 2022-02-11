const express = require('express');
const router = express.Router();
const {
	fetchAllCategories,
	createCategory,
	fetchCategoryId,
	fetchCategoryById,
} = require('../controllers/category');

router.get('/categories', fetchAllCategories);

router.post('/categories', createCategory);

router.param('id', fetchCategoryId);

router.get('/categories/:id', fetchCategoryById);

module.exports = router;
