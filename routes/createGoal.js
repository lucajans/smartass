const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Goal = require("../models/Goal.model");

router.get("/createGoal", (req, res) => {
  res.render("create-goal");
});

router.post("/createGoal", (req, res) => {
  Goal.create({
    category,
    goalNumber,
    startDate,
    endDate,
  });
});

module.exports = router;
