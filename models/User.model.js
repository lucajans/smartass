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
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    lowercase: true,
  },
  privacy: {
    type: String,
    required: false,
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
