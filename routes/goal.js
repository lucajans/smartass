const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Goal = require("../models/Goal.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/createGoal", isLoggedIn, (req, res) => {
  res.render("create-goal", { user: req.session.user });
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
router.get("/user/goals/:goalId/edit", isLoggedIn, (req, res) => {
  const goalId = req.params.goalId;
  Goal.findById(goalId).then((foundGoal) => {
    console.log("We found the goal: ", foundGoal);
    if (!foundGoal) {
      console.log("This goal doesn't exist.");
      return res.redirect("/user/dashboard");
    }
    res.render("update-goal", { goal: foundGoal, user: req.session.user });
  });
});

router.post("/user/goals/:goalId/edit", isLoggedIn, (req, res, next) => {
  const { goalName, category, goalNumber, startDate, endDate } = req.body;
  const goalId = req.params.goalId;
  Goal.findByIdAndUpdate(
    goalId,
    {
      goalName: goalName,
      category: category,
      goalNumber: goalNumber,
      startDate: startDate,
      endDate: endDate,
    },
    { new: true }
  )
    .then((editedGoal) => {
      // req.params = editedGoal;
      console.log(editedGoal);
      res.render("user-goal", { user: req.session.user, goal: editedGoal });
    })
    .catch((err) => {
      console.log("We could not process this change. Run!: ", err);
    });
});

//remove goal
router.get("/user/goals/:goalId/byebye", isLoggedIn, (req, res) => {
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
