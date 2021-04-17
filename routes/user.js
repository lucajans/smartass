const router = require("express").Router();
const User = require("../models/User.model");

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

/* GET user goodbye page */
router.get("/goodbye", (req, res, next) => {
  res.render("user/goodbye", { user: req.session.user });
});

/* GET other user profile */
router.get("/profile/:userId", (req, res, next) => {
  // Here we check if the user with given username exists
  const userId = req.params.userId;
  User.findById(userId).then((thisUser) => {
    console.log("We found this user: ", thisUser);
    if (!thisUser) {
      console.log("This user doesn't exist.");
      return res.redirect("/");
    }

    // By now we know that the user exists. Here we get the information we need.
    res.render("user/stranger-profile-public", { thisUser });
  });
});

/* GET user personal friends page */
router.get("/my-friends", (req, res, next) => {
  res.render("user/my-friends", { user: req.session.user });
});

/* GET user invites another user to friends */
router.get("/profile/:userId/invitation-sent", (req, res, next) => {
  const invitedUser = req.params.userId;
  const invitingUser = req.session.user._id;
  User.findByIdAndUpdate(
    invitedUser,
    { $addToSet: { receivedInvitations: invitingUser } },
    { new: true }
  ).then(() => {
    User.findByIdAndUpdate(
      invitingUser,
      { $addToSet: { pendingInvitations: invitedUser } },
      { new: true }
    ).then((updatedInvitedUser) => {
      console.log("Updated inviting user: ", updatedInvitedUser);
      res.redirect("/user/my-friends");
      return;
    });
  });
});

module.exports = router;
