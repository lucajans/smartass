const { Schema, model } = require("mongoose");

const goalSchema = new Schema({
  goalName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "books",
      "movies",
      "runs",
      "gym sessions",
      "bike rides",
      "cooking at home",
    ],
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
    default: 0,
  },
  progress: {
    type: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Goal = model("Goal", goalSchema);
module.exports = Goal;
