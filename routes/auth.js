const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

// Middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const { replaceOne } = require("../models/User.model");

// SIGNUP

// Signup page router
router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { username: "", fullname: "", email: "" });
});

router.post("/signup", (req, res, next) => {
  // console.log("The user data:", req.body);
  const { username, email, fullname, password, repeatpassword } = req.body;
  // Here we specify that all the fields in the form are required
  if (!username || !email || !fullname || !password || !password) {
    res.render("auth/signup", {
      errorMessage: "Some fields are not filled in!",
    });
    console.log("Some fields are not filled in!");
  }

  // Here we set a minimum value for the password (8 characters)
  if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "The password needs to have minimum 8 characters",
    });
    console.log("The password is too short!");
  }

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log(`Hashed password is: ${hashedPassword}`);

  bcrypt
    .genSalt(saltRounds)
    .then((saltRounds) => bcrypt.hash(password, saltRounds))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        fullname,
        password: hashedPassword,
        privacy: "public",
        location: "",
        favouriteMovie: "",
        favouriteBook: "",
        description: "",
        profilePicture: "",
        colorMode: "blue",
        friends: [],
      }).then((newUser) => {
        console.log("newUser: ", newUser);
        req.session.user = newUser;
        res.redirect("/onboarding");
      });
    })
    .catch((err) => {
      console.log("Err: ", err);
    });
});

router.get("/user/my-profile", (req, res, next) => {
  const obj = {};
  if (req.session.user) {
    obj.user = req.session.user;
  }
  res.render("user/my-profile", { ...obj });
});

// LOGIN
router.get("/login", (req, res, next) => {
  res.render("auth/login", { user: req.session.user });
});

router.post("/login", (req, res, next) => {
  console.log("SESSION ===>", req.session);
  console.log("The user data: ", req.body);
  const { email, password } = req.body;
  if (email == "" || password == "") {
    res.render("auth/login", {
      errorMessage: "Please enter both the username and the password",
    });
    return;
  }
  User.findOne({ email }).then((foundUser) => {
    console.log("USER: ", foundUser);
    if (!foundUser) {
      res.render("auth/login", {
        errorMessage: "Wrong credentials – no user found",
      });
      console.log("No user found");
      return;
    }
    // Here we know that the user with given username exists
    // Let's validate the password
    const isPasswordOkay = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordOkay) {
      res.render(
        "auth/login",
        { errorMessage: "Wrong password!" },
        { user: req.session.user }
      );
      return;
    }
    // Here we know the login is successfull!
    req.session.user = foundUser;
    res.redirect("/user/my-profile");
    console.log(req.session.user);
  });
});

// LOG OUT
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    console.log("The session is destroyed. The cookie is cleared.");
    if (err) {
      return res.status(500).render("/", {
        errorMessage: err.message,
      });
      console.log("Something went wrong with the logout");
    }
    res.render("auth/logout");
  });
});

// router.post("/logout", (req, res) => {
//   req.session.destroy();
//   res.clearCookie("connect.sid");
//   res.redirect("/auth/logout");
// });

module.exports = router;
