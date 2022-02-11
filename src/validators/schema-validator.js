const Joi = require('joi');

const CatrgorySchema = Joi.object({
	name: Joi.string().required().min(5).max(30),
});

const DishSchema = Joi.object({
	name: Joi.string().required().min(5).max(30),
	description: Joi.string().required().min(10).max(150),
	price: Joi.number().required(),
	category: Joi.string().required(),
});

module.exports = { CatrgorySchema, DishSchema };