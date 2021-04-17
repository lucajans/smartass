const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.model");

router.get(
  "/user/dashboard",
  /** user must be loggedin, */ (req, res, next) => {
    Goal.find({})
      //   Goal.find({owner: req.session.user._id})
      .then((allGoals) => {
        const withProgress = allGoals.map((oneGoal) => {
          console.log(oneGoal);
          // Calculate what is the current percentage
          const percentage = (oneGoal.currentNumber / oneGoal.goalNumber) * 100;
          // Return the oneGoal variable with a percentage property
          return {
            ...oneGoal.toJSON(),
            percentage,
          };
        });
        res.render("dashboard", { dashboardGoals: withProgress });
      })
      .catch((err) => {
        console.log("Error while loading the goals", err);
      });
  }
);

router.get("/user/goals/:goalId", (req, res, next) => {
  Goal.findById(req.params.goalId)
    .then((foundGoal) => {
      res.render("user-goal", { goal: foundGoal });
    })
    .catch((error) => {
      console.log("Error while retrieving goal details: ", error);
      next(error);
    });
});

router.get("/user/goals/:goalId/progress", (req, res, next) => {
  const { goalId } = req.params;
  Goal.findByIdAndUpdate(goalId, { $inc: { currentNumber: 1 } }).then(
    (progressGoal) => {
      res.redirect("/user/dashboard");
    }
  );
});

module.exports = router;
