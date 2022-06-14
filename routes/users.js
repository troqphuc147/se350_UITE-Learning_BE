const express = require("express");
const router = express.Router();
//middleware
const authMiddleware = require('../middleware/auth')
//controller
const userController = require('../controllers/userController');

router.get("/verify", userController.verifyUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current-user", authMiddleware.onlyUser, userController.getCurrentUser);

router.get(
  "/test",
  authMiddleware.onlyUser,
  userController.test
);

router.put('/reset-password',authMiddleware.onlyUser,userController.resetPassword)
router.put('/get-new-password', userController.getNewPassword);

module.exports = router;
