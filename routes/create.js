const express = require("express");
const router = express.Router();
const createCtrl = require("../controller/create.controller");

// GET home page
router.post("/register", createCtrl.register);
router.post("/login", createCtrl.login);
router.post("/reset", createCtrl.reset_password);
module.exports = router;