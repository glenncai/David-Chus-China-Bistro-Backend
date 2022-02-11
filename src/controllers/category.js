const Category = require('../models/category');
const { CatrgorySchema } = require('../validators/schema-validator');
const createError = require('http-errors');
const mongoose = require('mongoose');

exports.fetchCategoryId = async (req, res, next, id) => {
	try {
		const category = await Category.findById(id);
		if (!category) {
			return next(createError(404, 'Category not found.'));
		}
		req.category = category;
		next();
	} catch (error) {
		if (error instanceof mongoose.CastError) {
			return next(createError(400, 'Invalid categoty id.'));
		}
		next(error);
	}
};

exports.fetchAllCategories = async (req, res, next) => {
	try {
		const result = await Category.find({});
		if (result.length === 0) {
			return next(createError(404, 'No categories found.'));
		}

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.createCategory = async (req, res, next) => {
	try {
		const result = await CatrgorySchema.validateAsync(req.body);
		const category = new Category(result);
		category.addedBy = 'Glenn';
		await category.save();
		res.status(201).json(category);
	} catch (error) {
		// Validate input error
		if (error.isJoi === true) {
			error.status = 422;
		}

		// Category already exists (handle MongoServerError E11000 error)
		if (error.message.includes('E11000')) {
			return next(
				createError.Conflict(`Category name ${req.body.name} already exists.`),
			);
		}
		next(createError(error));
	}
};

exports.fetchCategoryById = async (req, res) => {
	res.status(200).json(req.category);
};
