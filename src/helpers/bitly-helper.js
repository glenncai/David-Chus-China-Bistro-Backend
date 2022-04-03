const BitlyClient = require('bitly').BitlyClient;
const accessToken = process.env.BITLY_ACCESS_TOKEN;
const bitly = new BitlyClient(accessToken);

const shortenURL = async (longURL) => {
	try {
		const result = await bitly.shorten(longURL);
		return result.link;
	} catch (error) {
		console.log(error);
	}
};

module.exports = { shortenURL };
