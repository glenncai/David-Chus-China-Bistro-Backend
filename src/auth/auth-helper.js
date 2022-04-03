const getUser = (req) => {
	const userId = req.user.gty ? process.env.UT_USER : req.user.sub.split('|')[1];
	return userId;
};

module.exports = { getUser };
