const { Schema, model } = require("mongoose");

const goalSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ["Books", "Movies"],
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
});

const Goal = model("Goal", goalSchema);
module.exports = Goal;
