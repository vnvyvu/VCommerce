/** Library for creating http errors */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
/** Library for parsing cookie for express */
const cookieParser = require('cookie-parser');
/** Library for logging */
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/** Get index router objects */
const indexRouter = require('./routes/index');

const app = express();

/** db connect */
mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

/** view path and view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Middleware is a function with req, res, next parameters.
 * Middleware stands between the server and the client,
 * every request and response has to go through it.
 * In middleware, request and response information can be modified.
 * app.use() will allow all HTTP methods can pass through
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

/**
 * Declare routes, availabel routes
 * Route is a address of the destination when user visits your website.
 * A route can include its child-routes.
 */
app.use('/', indexRouter);

/** When above routes does not exist, use http-errors to create 404 error */
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).json(res.locals.error);
});

module.exports = app;
