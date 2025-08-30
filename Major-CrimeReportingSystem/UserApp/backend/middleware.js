module.exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports.PoliceAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
