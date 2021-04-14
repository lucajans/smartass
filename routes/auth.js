const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

// SIGNUP

// Signup page router
router.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup", { username: "", fullname: "", email: "" });
});

router.post("/signup", (req, res, next) => {
  console.log("The user data:", req.body);
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

  // Here we specify that repeat password needs to match the first password
  if (password != repeatpassword) {
    res.render("auth/signup", {
      errorMessage: "The passwords are not the same",
    });
    console.log("The passwords are not the same");
  }

  // Here we need to check whether this username or email is already in use
  User.findOne({ $or: [{ username }, { email }] })
    .then((foundUser) => {
      if (foundUser) {
        res.render("signup", {
          errorMessage:
            "A user with this username/ email already exists. Choose a different one.",
        });
        return;
      }
      // Here we already know the username and email are unique
      const generatedSalt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, generatedSalt);
      User.create({
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
        res.redirect("onboarding");
      });
    })
    .catch((err) => {
      console.log("Err: ", err);
    });
});

router.get("user/profile", (req, res, next) => {
  const obj = {};
  if (req.session.user) {
    obj.user = req.session.user;
  }
  res.render("user/profile", { ...obj });
});

// LOGIN
router.get("/auth/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION ===>", req.session);
  console.log("The user data: ", req.body);
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("auth/login", {
      errorMessage: "Please enter both the username and the password",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try again or sign up.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password. Please, try again.",
        });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
