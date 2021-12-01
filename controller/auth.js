const User = require('../model/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const createError = require('http-errors');
require("dotenv").config();
module.exports = {
    register: async (req, res, next) => {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    },
    login: async (req, res, next) => {
        req.user = await User.findOne({
            email: req.body.email, hashedPassword: new User({ password: req.body.password }).hashedPassword
        });
        if(!req.user) return next(createError(403));
        const token = jwt.sign({_id: req.user._id}, process.env.JWT_SECRET_KEY);
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.json({ token, user: req.user });
    },
    logout: (req, res, next) => {
        res.clearCookie('token');
        res.json("Success");
    },
    checkLogin: expressJwt({
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ["HS256"],
        getToken: (req)=>req.cookies["token"], 
        requestProperty: "auth"
    }),
    checkAuthor: (req, res, next) => {
        if(req.user&&req.auth&&req.user._id==req.auth._id) next();
        else next(createError(403, "Author"));
    }, 
    checkAdmin: (req, res, next) => {
        if(req.user.role==1) next();
        else next(createError(403, "Admin"));
    }
}