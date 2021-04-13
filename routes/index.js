const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.redirect("/auth/signup");
});

router.get("/login", (req, res) => {
  res.redirect("/auth/login");
});

module.exports = router;
