const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		checkout_session_id: {
			type: String,
		},
		placedBy: {
			type: String,
		},
		contents: {
			type: Array,
			default: [],
		},
		total: {
			type: Number,
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
			phone: {
				type: String,
			},
			country: {
				type: String,
			},
		},
		status: {
			type: Array,
			default: [],
		},
		__v: {
			type: Number,
			select: false,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
