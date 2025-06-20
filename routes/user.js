const express = require ("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js")
const wrapAsync =require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { route } = require("./review.js");

router
.route("/signup")
.get(userController.renderSignUpForm )
.post(wrapAsync(userController.signup));

// ======signin page ======
router
.route ("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' }),(userController.login) );


// ===== logout page ====
router.get("/logout",userController.logout);

module.exports = router;