const User = require('../models/user');
const createError = require('http-errors');
const { UserSchema } = require('../validators/schema-validator');

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
