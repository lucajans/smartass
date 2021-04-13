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
  fullname: {
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
  location: String,
  favouriteMovie: String,
  favouriteBook: String,
  description: String,
  profilePicture: {
    type: String,
  },
  colorMode: {
    type: String,
    default: "blue",
    enum: ["blue", "green", "orange"],
  },
  friends: [String],
});

const User = model("User", userSchema);

module.exports = User;
