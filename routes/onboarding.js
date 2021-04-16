const router = require("express").Router();
const User = require("../models/User.model");

/* GET onboarding page */
router.get("/", (req, res, next) => {
  res.render("onboarding/onboarding", { user: req.session.user });
});

/* GET onboarding step 1 page */
router.get("/step-1", (req, res, next) => {
  res.render("onboarding/step-1", { user: req.session.user });
});

/* GET onboarding step 1 page done */
router.get("/step-1/done", (req, res, next) => {
  res.render("onboarding/step-1-done", { user: req.session.user });
});

/* POST step 1: edit your profile */
router.post("/step-1/done", (req, res, next) => {
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
      res.redirect("/onboarding/step-1/done");
    })
    .catch((err) => {
      console.log("We have an error with saving the edited user: ", err);
    });
});

/* GET onboarding step 2 page */
router.get("/step-2", (req, res, next) => {
  res.render("onboarding/step-2", { user: req.session.user });
});

/* GET onboarding step 2 page done */
router.get("/step-2/done", (req, res, next) => {
  res.render("onboarding/step-2-done", { user: req.session.user });
});

/* GET onboarding step 3 page */
router.get("/step-3", (req, res, next) => {
  res.render("onboarding/step-3", { user: req.session.user });
});

/* GET onboarding step 3 page done */
router.get("/step-3/done", (req, res, next) => {
  res.render("onboarding/step-3-done", { user: req.session.user });
});

module.exports = router;
