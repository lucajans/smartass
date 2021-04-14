module.exports = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/", {
      errorMessage: "Only logged users can enter this page. Log in or sign up.",
    });
  }
  req.user = req.session.user;
  next();
};
