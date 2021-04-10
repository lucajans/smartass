const router = require("express").Router();

// GET signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
