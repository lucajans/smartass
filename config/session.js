const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // a cookie lasts for a month
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/smartass",
      }),
    })
  );
};
