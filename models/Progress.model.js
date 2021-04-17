const { Schema, model } = require("mongoose");

const progressSchema = new Schema({});

const Progress = model("Progress", progressSchema);
module.exports = Progress;
