const express = require('express');
const router = express.Router({mergeParams: true});

/** controller */
const controller = require("../controller/product");
const {checkLogin, checkAuthor} = require("../controller/auth");

router.post('/:userId/create', checkLogin, checkAuthor, controller.upload, controller.create);
router.delete('/:userId/delete/:productId', checkLogin, checkAuthor, controller.checkOwner, controller.delete);
router.patch('/:userId/update/:productId', checkLogin, checkAuthor, controller.checkOwner, controller.upload, controller.update);

router.get('/:productId', controller.product);
router.get('/', controller.search);

/** import params */
const {getUser} = require('../controller/user');
router.param('userId', getUser);
router.param('productId', controller.getProduct);

module.exports = router;