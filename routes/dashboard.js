const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.model");

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
  Goal.find().then((allGoals) => {
    console.log("allGoals:", allGoals);
  });
});

module.exports = router;
