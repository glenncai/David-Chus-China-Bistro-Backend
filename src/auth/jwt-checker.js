var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const jwtChecker = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),
	audience: `${process.env.AUTH0_AUDIENCE}`,
	issuer: `${process.env.AUTH0_DOMAIN}/`,
	algorithms: ['RS256'],
});

module.exports = { jwtChecker };
