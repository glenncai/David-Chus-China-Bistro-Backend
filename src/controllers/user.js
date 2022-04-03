const User = require('../models/user');
const createError = require('http-errors');
const { UserSchema } = require('../validators/schema-validator');

exports.fetchById = async (req, res, next, id) => {
	try {
		const user = await User.findById(id);
		if (!user) {
			return next(createError(404, 'User not found.'));
		}
		// Call jwtChecker, so we need to use internal_user
		req.internal_user = user;
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.getUserById = (req, res) => {
	res.status(200).json(req.internal_user);
};

exports.createUser = async (req, res, next) => {
	let user;

	console.log(req.user);
	try {
		const validatedData = await UserSchema.validateAsync(req.body);
		user = new User(validatedData);
		const newUser = await user.save();
		res.status(201).json(newUser);
	} catch (error) {
		// Validate input error
		if (error.isJoi === true) {
			error.status = 422;
		}

		// User already exists (handle MongoServerError E11000 error)
		if (error.message.includes('E11000')) {
			return next(createError.Conflict(`User with email ${user.email} already exists.`));
		}
		next(error);
	}
};

exports.updateAddress = async (req, res, next) => {
	const user = req.internal_user;
	const address = req.body;

	try {
		const updatedUserObj = await User.findByIdAndUpdate(
			{ _id: user._id },
			{ address },
			{ new: true, runValidators: true, context: 'query' },
		);
		res.status(200).json(updatedUserObj.address);
	} catch (error) {
		console.log(error);
		next(createError(error));
	}
};

exports.getUserAddress = (req, res, next) => {
	const address = req.internal_user.address;

	if (!address) {
		return next(createError(404, 'Address not found.'));
	}

	res.status(200).json(address);
};
