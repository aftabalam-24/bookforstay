let User = require("../models/user.model.js")

module.exports.signup = async (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
  let { email, username, password } = req.body;
  let user = new User({
    email,
    username,
  });
  let newUser = await User.register(user, password);
  req.logIn(newUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Welcome to wanderlust!");
    res.redirect("/listing");
  });
};

module.exports.login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "welcome back to wanderlust !");
  if (res.locals.redirectUrl === undefined) {
    console.log(req.user);
    res.redirect("/listing");
  } else {
    res.redirect(res.locals.redirectUrl);
  }
};

module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listing");
  });
};
