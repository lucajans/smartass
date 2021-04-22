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
  location: String,
  favouriteMovie: String,
  favouriteBook: String,
  description: String,
  profilePicture: {
    type: String,
    default:
      "https://www.pngitem.com/pimgs/m/516-5167304_transparent-background-white-user-icon-png-png-download.png",
  },
  pendingInvitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "607f0a11230786001554e307",
    },
  ],
  receivedInvitations: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = model("User", userSchema);

module.exports = User;
