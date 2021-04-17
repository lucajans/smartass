const { Schema, model } = require("mongoose");

const goalSchema = new Schema({
  goalName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["books", "movies"],
  },
  goalNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  currentNumber: {
    type: Number,
  },
  progress: {
    type: Number,
  },
});

const Goal = model("Goal", goalSchema);
module.exports = Goal;
