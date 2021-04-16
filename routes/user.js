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

/* POST user personal profile edition page */
router.post("/my-profile/edit", (req, res, next) => {
  console.log("User data after edition: ", req.body);
  const {
    username,
    fullname,
    profilePicture,
    email,
    location,
    description,
    favouriteBook,
    favouriteMovie,
    privacy,
    colorMode,
  } = req.body;

  User.findByIdAndUpdate(
    req.session.user._id, // the id of logged user (we use to identify the user whose data we update)
    {
      username: username,
      fullname: fullname,
      profilePicture: profilePicture,
      email: email,
      location: location,
      description: description,
      favouriteBook: favouriteBook,
      favouriteMovie: favouriteMovie,
      privacy: privacy,
      colorMode: colorMode,
    },
    { new: true }
  )
    .then((updatedUser) => {
      // Everything went fine, the user data got updated! Bravo!
      console.log("Updated user: ", updatedUser);
      req.session.user = updatedUser;
      res.redirect("/user/my-profile");
    })
    .catch((err) => {
      console.log("We have an error with saving the edited user: ", err);
    });
});

/* POST user personal profile deletion */
router.post("/my-profile/delete", (req, res) => {
  const userId = req.session.user._id;
  User.findByIdAndDelete(userId)
    .then(() => {
      console.log("The user is deleted. Kaboom!");
      res.render("user/goodbye");
      res.clearCookie("connect.sid");
    })
    .catch((err) => {
      console.log("We have an error deleting the user: ", err);
    });
});

/* GET user user goodbey page */
router.get("/goodbye", (req, res, next) => {
  res.render("user/goodbye", { user: req.session.user });
});

/* GET other user profile */
router.get("/profile/:username", (req, res, next) => {
  // Here we check if the user with given username exists
  User.findOne({ username: req.params.username }).then((thisUser) => {
    console.log("We found this user: ", thisUser);
    if (!thisUser) {
      console.log("This user doesn't exist.");
      res.render("user/goodbye");
    }

    // By now we know that the user exists. Here we get the information we need.
    res.render("user/user-profile");
  });
});

module.exports = router;
