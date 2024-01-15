const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  userDetailsValidator,
} = require("../middlewares/userDetails.validator");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { passwordValidator } = require("../middlewares/password.validator");

//API=>POST
router.post("/signup", userDetailsValidator, authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/reset-password/:id/:token",
  passwordValidator,
  authController.resetPassword
);
router.post("/logout", authenticateUser, authController.userLogout);

//API=>GET
router.get("/signup", (req, res, next) => {
  res.render("user-signup");
});
router.get("/login", (req, res, next) => {
  res.render("user-login");
});
router.get("/forgot-password", (req, res, next) => {
  res.render("forgot-password");
});
router.get("/reset-password/:id/:token", (req, res, next) => {
  const { id, username } = req.params;
  res.render("reset-password", { username });
});

module.exports = router;
