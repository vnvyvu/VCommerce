const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controller/auth');
const {
	registerRules,
	registerValidate,
	loginRules,
	loginValidate,
} = require('../controller/validator/authValidator');

router.post(
	'/register',
	...registerRules,
	registerValidate,
	controller.register
);
router.post('/login', ...loginRules, loginValidate, controller.login);
router.use('/logout', controller.logout);
router.post('/token', controller.token);

module.exports = router;
