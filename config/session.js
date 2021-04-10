const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 60 * 1000 ms === 1 min // updated for user being logged in for the whole month
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/smartass",
      }),
    })
  );
};
