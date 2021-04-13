const router = require("express").Router();
<<<<<<< HEAD
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

// SIGNUP

// Signup page router
router.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup", { username: "", fullname: "", email: "" });
=======
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { username: "", fullName: "", email: "" });
>>>>>>> 0913629d95ea76e97dea266b972feb7254a64fda
});

router.post("/signup", (req, res, next) => {
  console.log("The user data:", req.body);
<<<<<<< HEAD
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
=======
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
>>>>>>> 0913629d95ea76e97dea266b972feb7254a64fda
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
<<<<<<< HEAD
  console.log("SESSION ===>", req.session);
  console.log("The user data: ", req.body);
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("auth/login", {
      errorMessage: "Please enter both the username and the password",
    });
    return;
  }
  User.findOne({ username }).then((foundUser) => {
    if (!foundUser) {
      res.render("auth/login", { errorMessage: "Wrong credentials" });
      console.log("No user found");
      return;
    }
    // Here we know that the user with given username exists
    // Let's validate the password
    const isPasswordOkay = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordOkay) {
      res.render("auth/login", { errorMessage: "Wrong credentials!" });
      console.log("Wrong password");
      return;
    }
    // Here we know the login is successfull!
    req.session.user = foundUser;
    res.render("user/profile");
    console.log(req.session.user);
  });
});

// LOG OUT
router.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    if (err) {
      return res.status(500).render("auth/logout", {
        errorMessage: "Something went wrong with the logout",
        err,
      });
    }
  });
  res.redirect("/");
=======
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
>>>>>>> 0913629d95ea76e97dea266b972feb7254a64fda
});

module.exports = router;
