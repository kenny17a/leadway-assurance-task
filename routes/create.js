const express = require("express");
const router = express.Router();
const createCtrl = require("../controller/create.controller");
const middles = require("../middleware/authorize");

// GET home page
router.post("/register", createCtrl.register);
router.post("/login", createCtrl.login);
router.get("/get", middles, createCtrl.get);
router.post("/request_reset", createCtrl.request_password_reset)
router.post("/reset_password", createCtrl.reset_password)

module.exports = router; 