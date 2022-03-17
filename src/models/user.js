const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			full_name: {
				type: String,
			},
			line1: {
				type: String,
			},
			line2: {
				type: String,
			},
			city: {
				type: String,
			},
			state: {
				type: String,
			},
			zip: {
				type: String,
			},
			country: {
				type: String,
			},
			phone: {
				type: String,
			},
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
