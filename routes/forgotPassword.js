
const express = require('express');
const router = express.Router();

const controllers = require('../controllers/forgotPassword');
//const {AuthMiddleware} = require('../helper/JWT');
router.put("/forgot-password", controllers.GetUserByEmail, controllers.ForgotPassword);

module.exports = router;