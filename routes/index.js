const express = require('express');
const router = express.Router();

/** child routers
 * authRouter: register, login, logout
 *
 *
 */
const authRouter = require('./auth');
const userRouter = require('./user');
const categoryRouter = require('./category');
const productRouter = require('./product');

/** import controller */
const controller = require('../controller/index');

router.use('/:lang/auth', authRouter);
router.use('/:lang/users', userRouter);
router.use('/:lang/categories', categoryRouter);
router.use('/:lang/products', productRouter);

router.use('/:lang', controller.index);
router.use('/', controller.redirect);

/** import global params */
const getLang = require('../language/getLanguage');
router.param('lang', getLang);

module.exports = router;
