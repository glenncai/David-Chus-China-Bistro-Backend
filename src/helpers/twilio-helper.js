const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const From = process.env.TWILIO_MERCHANT_PHONE;

const sendMessage = (message, to) => {
	client.messages
		.create({
			body: message,
			from: From,
			to: '+' + to,
		})
		.then((message) => console.log('Done: ', message.sid))
		.catch((err) => console.log(err));
};

const createMessage = (orderId, url) => {
	const TEMPLATE_CREATE = `Thank you for ordering from David Chu's China Bistro. Prepaid order # ${orderId} will be delivered in the next 30 mins. You may track your order on ${url}`;
	return TEMPLATE_CREATE;
};

module.exports = { sendMessage, createMessage };
