const router = require("express").Router();
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const parser = require("../config/cloudinary");

/* GET user personal profile page */
router.get("/my-profile", isLoggedIn, (req, res, next) => {
  res.render("user/my-profile", { user: req.session.user });
});

/* GET user personal profile edition page */
router.get("/my-profile/edit", isLoggedIn, (req, res, next) => {
  res.render("user/my-profile-edit", { user: req.session.user });
});

/* POST user personal profile edition page */
router.post(
  "/my-profile/edit",
  isLoggedIn,
  parser.single("image"),
  (req, res, next) => {
    console.log(req.file);
    const profilePicture = req.file.path;
    const {
      username,
      fullname,
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
  }
);

/* POST user personal profile deletion */
router.post("/my-profile/delete", isLoggedIn, (req, res) => {
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
router.get("/goodbye", isLoggedIn, (req, res, next) => {
  res.render("user/goodbye", { user: req.session.user });
});

/* GET other user profile */
router.get("/profile/:userId", isLoggedIn, (req, res, next) => {
  // Here we check if the user with given username exists
  const userId = req.params.userId;
  User.findById(userId)
    .populate("friends")
    .then((thisUser) => {
      console.log("We found this user: ", thisUser);
      if (!thisUser) {
        console.log("This user doesn't exist.");
        return res.redirect("/user/my-friends");
      }
      if (
        thisUser.friends.find((el) => el.username === req.session.user.username)
      ) {
        return res.render("user/friend-profile", {
          thisUser,
          user: req.session.user,
        });
      }
      res.render("user/stranger-profile", { thisUser, user: req.session.user });
    });
});

/* GET user personal friends page */
router.get("/my-friends", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
    .populate([
      // { path: "friends", model: "User" },
      "friends",
      "pendingInvitations",
      "receivedInvitations",
    ])
    // .populate("friends pendingInvitations receivedInvitations")
    // .populate("friends")
    // .populate("pendingInvitations")
    // .populate("receivedInvitations")
    .then((loggedUser) => {
      res.render("user/my-friends", { user: loggedUser });
    });
});

/* GET user invites another user to friends */
router.get("/profile/:userId/invitation-sent", isLoggedIn, (req, res, next) => {
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

/* GET user accepts an invitation from another user */
router.get("/my-friends/accept/:userId", isLoggedIn, (req, res, next) => {
  const newFriend = req.params.userId;
  const loggedUser = req.session.user._id;
  User.findByIdAndUpdate(
    newFriend,
    { $addToSet: { friends: loggedUser } },
    { new: true }
  ).then(() => {
    User.findByIdAndUpdate(
      newFriend,
      { $pull: { pendingInvitations: loggedUser } },
      { new: true }
    ).then(() => {
      User.findByIdAndUpdate(
        loggedUser,
        { $addToSet: { friends: newFriend } },
        { new: true }
      ).then(() => {
        User.findByIdAndUpdate(
          loggedUser,
          { $pull: { receivedInvitations: newFriend } },
          { new: true }
        ).then((loggedUser) => {
          console.log("Updated logged user: ", loggedUser);
          res.redirect("/user/my-friends");
          return;
        });
      });
    });
  });
});

/* GET user rejects an invitation from another user */
router.get("/my-friends/reject/:userId", isLoggedIn, (req, res, next) => {
  const rejectedFriend = req.params.userId;
  const loggedUser = req.session.user._id;
  User.findByIdAndUpdate(
    rejectedFriend,
    { $pull: { pendingInvitations: loggedUser } },
    { new: true }
  ).then(() => {
    User.findByIdAndUpdate(
      loggedUser,
      { $pull: { receivedInvitations: rejectedFriend } },
      { new: true }
    ).then((loggedUser) => {
      console.log("Updated logged user: ", loggedUser);
      res.redirect("/user/my-friends");
      return;
    });
  });
});

/* GET user removes another user from friends */
router.get("/my-friends/remove/:userId", isLoggedIn, (req, res, next) => {
  const removedFriend = req.params.userId;
  const loggedUser = req.session.user._id;
  User.findByIdAndUpdate(
    removedFriend,
    { $pull: { friends: loggedUser } },
    { new: true }
  ).then(() => {
    User.findByIdAndUpdate(
      loggedUser,
      { $pull: { friends: removedFriend } },
      { new: true }
    ).then((loggedUser) => {
      console.log("Updated logged user: ", loggedUser);
      res.redirect("/user/my-friends");
      return;
    });
  });
});

/* POST user searches for friends by username of fullname */
router.get("/my-friends/search", isLoggedIn, (req, res, next) => {
  const searchQuery = req.query;
  console.log("This is searchQuery: ", searchQuery);
  console.log("This is searchQuery: ", searchQuery.search);
  User.findOne({ username: searchQuery.search }).then((foundUser) => {
    if (!foundUser) {
      User.findOne({ email: searchQuery.search }).then((foundUser) => {
        if (!foundUser) {
          return res.redirect("/user/my-friends");
          console.log("User not found. Your friends are not here yet!");
        }
      });
    }
    res.redirect(`/user/profile/${foundUser._id}`);
    return;
  });
});

module.exports = router;
