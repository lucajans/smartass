const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.model");

router.get("/dashboard", (req, res) => {
  Goal.find({}).then((allGoals) => {
    res.render("dashboard", { dashboardGoals: allGoals });
  });
});

module.exports = router;
