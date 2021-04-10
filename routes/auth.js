const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { username: "", fullName: "", email: "" });
});

router.post("/signup", (req, res, next) => {
  console.log("The user data:", req.body);
  const { username, fullName, email, password } = req.body;

  if (!username || !fullName || !email || !password) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "All these fields are mandatory. Please fill in the missing fields.",
      ...req.body,
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      ...req.body,
    });
    return;
  }

  const hashedPassword = bcryptjs.hashSync(password, saltRounds);
  console.log(`Hashed password is: ${hashedPassword}`);

  bcryptjs
    .genSalt(saltRounds)
    .then((saltRounds) => bcryptjs.hash(password, saltRounds))
    .then((hashedPassword) => {
      return User.create({
        username,
        fullName,
        email,
        password: hashedPassword,
        location: "",
        privacy: "public",
        profilePicture: "",
        favouriteMovie: "",
        favouriteBook: "",
        description: "",
      });
    })
    .then((userInDB) => {
      console.log(`New user in DB is:`, userInDB);
      req.session.user = userInDB;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(500)
          .render("auth/signup", { errorMessage: error.message, ...req.body });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Someone already used this username or email. Please try again.",
          ...req.body,
        });
      } else {
        next(error);
      }
    });
});

// Placeholder for redirecting user after sign-up. Needs to be changed.

router.get("/userProfile", (req, res, next) => {
  const obj = {};
  if (req.session.user) {
    obj.user = req.session.user;
  }
  res.render("user-profile", { ...obj });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION ==> ", req.session);
  console.log("The user data:", req.body);
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both email and password fields",
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
      } else if (bcryptjs.compareSync(password, user.password)) {
        res.render("user-profile", { user });
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password. Please, try again.",
        });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
