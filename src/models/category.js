const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			minlength: 5,
			maxlength: 30,
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

module.exports = mongoose.model('Categoty', categorySchema);
