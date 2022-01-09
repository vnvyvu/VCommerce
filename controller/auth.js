const User = require('../model/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const createError = require('http-errors');
require('dotenv').config();
module.exports = {
	register: async (req, res, next) => {
		const user = new User(req.body);
		await user.save();
		res.json(user);
	},
	login: async (req, res, next) => {
		const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
			expiresIn: '15s',
		});
		req.user.refreshToken = jwt.sign(
			{ _id: req.user._id },
			process.env.JWT_SECRET_REFRESH
		);
		req.user = await req.user.save();

		const { refreshToken, hashedPassword, ...data } = req.user.toObject();
		res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
		res.cookie('refreshToken', refreshToken, { httpOnly: true });
		res.json({ user: data, expiresIn: Date.now() + 15 * 1000 });
	},
	logout: (req, res, next) => {
		res.clearCookie('token');
		res.clearCookie('refreshToken');
		res.json('Success');
	},
	token: async (req, res, next) => {
		req.user = await User.findOne({
			_id: req.body._id,
			refreshToken: req.cookies['refreshToken'],
		});
		if (!req.user) return next(createError(401));
		const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
			expiresIn: '15s',
		});
		const { refreshToken, hashedPassword, ...data } = req.user.toObject();
		res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
		res.json({ user: data, expiresIn: Date.now() + 15 * 1000 });
	},
	checkLogin: expressJwt({
		secret: process.env.JWT_SECRET,
		algorithms: ['HS256'],
		getToken: (req) => req.cookies['token'],
		requestProperty: 'auth',
	}),
	checkAuthor: (req, res, next) => {
		if (req.user && req.auth && req.user._id == req.auth._id) next();
		else next(createError(403, 'Author'));
	},
	checkAdmin: (req, res, next) => {
		if (req.user.role == 1) next();
		else next(createError(403, 'Admin'));
	},
};
