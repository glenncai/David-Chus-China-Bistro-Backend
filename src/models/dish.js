const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			minlength: 5,
			maxlength: 50,
		},
		description: {
			type: String,
			required: true,
			minlength: 10,
			maxlength: 250,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Categoty',
			required: true,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		addedBy: {
			type: String,
			required: true,
		},
		__v: {
			type: Number,
			select: false,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Dish', dishSchema);
