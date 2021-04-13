const router = require("express").Router();

/* GET onboarding page */
router.get("/onboarding", (req, res, next) => {
  res.render("user/onboarding");
});

/* GET user profile page */
router.get("/profile", (req, res, next) => {
  res.render("user/profile");
});

module.exports = router;
