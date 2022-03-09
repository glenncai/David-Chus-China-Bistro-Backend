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
const userRoutes = require('./routes/user');

// Port
const PORT = process.env.PORT;
// Database
const DATABASE = process.env.DATABASE;
// Prefix
const PREFIX = '/' + process.env.PREFIX;

// CORS option
const corsOptions = {
	origin: process.env.CORS_ORIGIN,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Use routes
app.use(PREFIX, categoryRoutes);
app.use(PREFIX, dishRoutes);
app.use(PREFIX, userRoutes);

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
