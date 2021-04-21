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

// update goal
router.post("/user/:goalId/edit", (req, res, next) => {
  const { goalName, category, goalNumber, startDate, endDate } = req.body;
  Goal.findByIdAndUpdate(req.params._id, {
    goalName: goalName,
    category: category,
    goalNumber: goalNumber,
    startDate: startDate,
    endDate: endDate,
  })
    .then((editedGoal) => {
      res.redirect("/user/dashboard");
    })
    .catch((err) => {
      console.log("We could not process this change. Run!: ", err);
    });
});

//remove goal
router.get("/user/goal/:goalId", (req, res) => {
  const { goalId } = req.params;
  Goal.findByIdAndDelete(goalId)
    .then(() => {
      console.log("This goal is gone. Go kiss a tree!");
      res.redirect("/user/dashboard");
    })
    .catch((err) => {
      console.log("We failed to delete this goal: ", err);
    });
});

module.exports = router;
