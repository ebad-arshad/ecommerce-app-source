const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Middleware to verify the token
 */
module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.includes("Bearer")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: "Not authenticated" });
  }
};