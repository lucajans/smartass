const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Goal = require("../models/Goal.model");

router.get("/createGoal", (req, res) => {
  res.render("create-goal");
});

// must be logged in
// Goal.create ({ goalName, category, goalNumber, startDate, endDate, owner: req.session.user._id })
router.post("/createGoal", (req, res) => {
  const { goalName, category, goalNumber, startDate, endDate } = req.body;
  Goal.create({
    goalName,
    category,
    goalNumber,
    startDate,
    endDate,
  })
    .then((goalInDB) => {
      console.log("New goal created!");
      res.redirect("/user/dashboard");
    })
    .catch((error) => console.log("We found an error:", error));
});

module.exports = router;
