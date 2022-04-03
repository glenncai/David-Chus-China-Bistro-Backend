const Payment = require('../models/payment');
const Order = require('../models/order');
const createError = require('http-errors');
const { shortenURL } = require('../helpers/bitly-helper');
const { createMessage, sendMessage } = require('../helpers/twilio-helper');

exports.fulfillOrder = async (req, res, next) => {
	console.log(req.body);

	const event = req.body;
	switch (event.type) {
		case 'checkout.session.completed':
			const sessionCompleted = event.data.object;
			try {
				console.log(sessionCompleted.payment_intent);
				await Payment.findByIdAndUpdate(
					{ _id: sessionCompleted.id },
					{ payment_intent: sessionCompleted.payment_intent },
				);

				// Get buyer phone number
				const order = await Order.findOne({ checkout_session_id: sessionCompleted.id });
				const phoneNum = order.address.phone;

				// Form a order URL
				const orderTrackingURL = `https://davidchuschinabistro.netlify.app/orders/${order._id}`;

				// Create tiny URL
				const tinyURL = await shortenURL(orderTrackingURL);

				// Form a order success message
				const userMessage = createMessage(order._id, tinyURL);

				// Send message
				sendMessage(userMessage, phoneNum);
			} catch (error) {
				console.log(error);
				next(createError(error));
			}
			break;
		default:
			break;
	}

	res.status(200).json({ message: 'Successfully Handled!' });
};
