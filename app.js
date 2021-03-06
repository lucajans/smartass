// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config/")(app);
require("./config/session")(app);

// default value for title local
const projectName = "smartass";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const goal = require("./routes/goal");
app.use("/", index);
app.use("/", auth);
app.use("/", dashboard);
app.use("/", goal);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const onboardingRoutes = require("./routes/onboarding");
app.use("/onboarding", onboardingRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
