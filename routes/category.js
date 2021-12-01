const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require("../controller/category");
const { checkLogin, checkAuthor, checkAdmin } = require('../controller/auth');

router.post('/:userId/create', checkLogin, checkAuthor, checkAdmin, controller.create);
router.delete('/:userId/delete/:categoryId', checkLogin, checkAuthor, checkAdmin, controller.delete);
router.patch('/:userId/update/:categoryId', checkLogin, checkAuthor, checkAdmin, controller.update);

router.get('/:categoryId', controller.category);
router.get('/', controller.search);

/** import params */
const {getUser} = require('../controller/user');
router.param('userId', getUser);
router.param('categoryId', controller.getCategory);

module.exports = router;