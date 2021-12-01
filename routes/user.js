const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require('../controller/user');

const {checkLogin, checkAuthor} = require('../controller/auth');
const {updationRules, updationValidate} = require('../controller/validator/userValidator');

router.patch('/:userId', checkLogin, checkAuthor, updationRules, updationValidate, controller.update);

router.get('/:userId', checkLogin, controller.profile);
router.get('/', checkLogin, controller.search);

/** import params */
const {getUser} = require('../controller/user');
router.param('userId', getUser);

module.exports = router