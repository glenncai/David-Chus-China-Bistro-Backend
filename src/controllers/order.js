const { initialCheckoutSession } = require('../helpers/stripe-helper');
const createError = require('http-errors');
const User = require('../models/user');
const Order = require('../models/order');
const Payment = require('../models/payment');
const { v4: uuidv4 } = require('uuid');
const { ORDER_PLACED, ORDER_ABANDONED } = require('../lib/constants');
const { getUser } = require('../auth/auth-helper');

exports.createOrder = async (req, res, next) => {
	const { order_data } = req.body;
	const { dishes, address, order_total } = order_data;
	const orderId = uuidv4();
	const status = { event: ORDER_PLACED, onDate: new Date() };
	const userId = getUser(req);

	try {
		// Create a checkout session for stripe
		const session = await initialCheckoutSession(
			{
				amount: order_total,
				user_name: address.full_name,
			},
			next,
		);

		// Create a new order collection
		const order = Order({
			_id: orderId,
			checkout_session_id: session.id,
			placedBy: userId, // user id
			contents: dishes,
			total: order_total,
			address: address,
		});
		order.status.push(status);
		const newOrder = await order.save();

		// Add the order to the user collection
		const userFilter = { _id: userId };
		const updateAction = { $push: { order_history: newOrder } };
		let updateUser = await User.findOneAndUpdate(userFilter, updateAction, { new: true });

		// Add payment object in payment collection
		const payment = new Payment({ _id: session.id, order_id: orderId });
		await payment.save();

		res.status(201).json({ redirect: session.url });
	} catch (error) {
		console.log(error);
		next(createError(error));
	}
};

exports.getOrderById = async (req, res, next, id) => {
	const criteria = {
		$or: [{ _id: { $in: id } }, { checkout_session_id: { $in: id } }],
	};

	try {
		const order = await Order.findOne(criteria);
		if (!order) {
			return next(createError(404, 'Order not found.'));
		}

		req.order = order;
		next();
	} catch (error) {
		console.log(error);
		next(createError(error));
	}
};

// When the user click the cancel while paying, change the order status to abandoned
exports.updateOrderStatus = async (req, res, next) => {
	const userId = getUser(req);
	const order = req.order;
	const updatedStatus = order.status;

	const newEvent = { event: ORDER_ABANDONED, onDate: new Date() };
	updatedStatus.push(newEvent);

	try {
		order.status = updatedStatus;

		// Update order's status
		const updatedOrder = await order.save();

		// Update user's order_history document
		const user = await User.findById({ _id: userId });
		const updatedOrderHistory = user.order_history;
		const userOrder = updatedOrderHistory.find(
			(user_order) => user_order._id === order._id,
		);
		userOrder.status.push(newEvent);

		await User.updateOne({ _id: userId }, { order_history: updatedOrderHistory });

		res.status(200).json({ status: updatedOrder.status[updatedOrder.status.length - 1] });
	} catch (error) {
		console.log(error);
		next(createError(error));
	}
};
