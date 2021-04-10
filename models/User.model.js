const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  privacy: {
    type: String,
    required: true,
    enum: ["public", "private"],
  },
  location: {
    type: String,
    required: true,
  },
  favouriteMovie: String,
  favouriteBook: String,
  description: String,
  profilePicture: {
    type: String,
    required: true,
  },
  colorMode: {
    type: String,
    required: true,
    default: "blue",
    enum: ["blue", "green", "orange"],
  },
  friends: [String],
});

const User = model("User", userSchema);

module.exports = User;
