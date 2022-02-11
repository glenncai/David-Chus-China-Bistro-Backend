const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const createError = require('http-errors');
require('dotenv').config();

// Use express
const app = express();

// Import routes
const categoryRoutes = require('./routes/category');
const dishRoutes = require('./routes/dish');

// Port
const PORT = process.env.PORT;
// Database
const DATABASE = process.env.DATABASE;
// Prefix
const PREFIX = '/' + process.env.PREFIX;

// Middleware
app.use(cors());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	);
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Use routes
app.use(PREFIX, categoryRoutes);
app.use(PREFIX, dishRoutes);

// Listen port
app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}.`);

	// Connect to database
	try {
		await mongoose.connect(DATABASE, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to MongoDB!');
	} catch (error) {
		console.log(error);
	}
});

// Error handling semantics
app.use(async (req, res, next) => {
	next(createError.NotFound());
});

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		error: {
			status: err.status || 500,
			message: err.message || 'Internal Server Error',
		},
	});
});
