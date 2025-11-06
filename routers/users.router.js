let express = require("express");
let router = express.Router();
let User = require("../models/user.model.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware/auth.middleware.js");
const userControllers = require("../controllers/user.controller.js");

router.get("/signup", userControllers.signup);

router.post("/signup", userControllers.signupUser);

router.get("/login", userControllers.login);

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  userControllers.loginUser
);

router.get("/logout", userControllers.logoutUser);

module.exports = router;
