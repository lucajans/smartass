const router = require("express").Router();
const User = require("../models/User.model");

/* GET onboarding page */
router.get("/onboarding", (req, res, next) => {
  res.render("user/onboarding", { user: req.session.user });
});

/* GET user personal profile page */
router.get("/my-profile", (req, res, next) => {
  res.render("user/my-profile", { user: req.session.user });
});

/* GET user personal profile edition page */
router.get("/my-profile/edit", (req, res, next) => {
  res.render("user/my-profile-edit", { user: req.session.user });
});

/* GET other user profile */
router.get("/profile/:username", (req, res, next) => {
  // Here we check if the user with given username exists
  User.findOne({ username: req.params.username }).then((thisUser) => {
    console.log("We found this user: ", thisUser);
    if (!thisUser) {
      console.log("This user doesn't exist.");
      res.redirect("/");
    }

    // By now we know that the user exists. Here we get the information we need.
    res.render("user/user-profile");
  });
});

module.exports = router;
