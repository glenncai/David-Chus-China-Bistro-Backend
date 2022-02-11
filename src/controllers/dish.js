const Dish = require('../models/dish');
const createError = require('http-errors');
const { DishSchema } = require('../validators/schema-validator');
const imageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
const mongoose = require('mongoose');

exports.createDish = async (req, res, next) => {
	const { name, description, price, category, photo } = req.body;
	let dish;
	console.log(req.body);

	try {
		const result = await DishSchema.validateAsync({
			name,
			description,
			price,
			category,
		});
		dish = new Dish(result);
		dish.addedBy = 'Glenn';
		savePhoto(dish, photo);
		const newDish = await dish.save();
		newDish.photo = undefined;
		res.status(201).json(newDish);
	} catch (error) {
		console.log(error);

		// Validate input error
		if (error.isJoi === true) {
			error.status = 422;
		}

		// Dish already exists (handle MongoServerError E11000 error)
		if (error.message.includes('E11000')) {
			return next(
				createError.Conflict(`The dish ${dish.name} already exists.`),
			);
		}
		next(error);
	}
};

exports.fetchDishId = async (req, res, next, id) => {
	try {
		const dish = await Dish.findById(id);
		if (!dish) {
			return next(createError(404, 'Dish not found.'));
		}
		req.dish = dish;
		next();
	} catch (error) {
		if (error instanceof mongoose.CastError) {
			return next(createError(400, 'Invalid categoty id.'));
		}
		next(error);
	}
};

exports.fetchDishById = async (req, res) => {
	req.dish.photo = undefined;
	res.status(200).json(req.dish);
};

exports.fetchDishes = async (req, res, next) => {
	try {
		const dishes = await Dish.find()
			.select('-photo')
			.populate('category', '_id, name'); // refer to category field and includes _id and name columns.

		if (dishes.length === 0) {
			return next(createError(404, 'No dishes not found.'));
		}

		res.status(200).json(dishes);
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.fetchDishPhoto = async (req, res) => {
	const dish = req.dish;
	if (dish.photo.data) {
		res.set('Content-Type', dish.photo.contentType);
		res.send(dish.photo.data);
	} else {
		return res.status(204).json({ message: 'No data found.' });
	}
};

const savePhoto = (dish, photo) => {
	// TODO: Handle empty object scenario using ladash
	if (photo !== null && imageTypes.includes(photo.type)) {
		dish.photo.data = new Buffer.from(photo.data, 'base64');
		dish.photo.contentType = photo.type;
	}
};
