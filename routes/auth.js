const router = require("express").Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("The user data:", req.body);
});

module.exports = router;
