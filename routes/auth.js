const express = require("express");
const router = express.Router({mergeParams: true});

const controller = require("../controller/auth");
const {registerRules, registerValidate} = require("../controller/validator/authValidator");

router.post("/register", ...registerRules, registerValidate, controller.register);
router.post("/login", controller.login);
router.use("/logout", controller.logout);

module.exports = router;
