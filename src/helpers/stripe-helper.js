const stripe = require('stripe')(process.env.STRIPE_SCECRET_KEY);
const createError = require('http-errors');

const initialCheckoutSession = async (paymentObj, next) => {
	const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'hkd',
						product_data: {
							name: paymentObj.user_name,
						},
						unit_amount: parseInt(paymentObj.amount) * 100,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: `${FRONTEND_DOMAIN}/cart?success=true&id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${FRONTEND_DOMAIN}/cart?canceled=true&id={CHECKOUT_SESSION_ID}`,
		});

		return session;
	} catch (error) {
		console.log(error);
		next(createError(error));
	}
};

module.exports = { initialCheckoutSession };
