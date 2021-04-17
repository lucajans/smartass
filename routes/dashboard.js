const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.model");

router.get("/user/dashboard", (req, res, next) => {
  Goal.find({})
    .then((allGoals) => {
      res.render("dashboard", { dashboardGoals: allGoals });
    })
    .catch((err) => {
      console.log("Error while loading the goals", err);
    });
});

router.get("/user/goals/:goalId", (req, res, next) => {
  const { goalId } = req.params;
  Goal.findById(goalId)
    .then((foundGoal) => res.render("user-goal", { goal: foundGoal }))
    .catch((error) => {
      console.log("Error while retrieving goal details: ", error);
      next(error);
    });
});

module.exports = router;
