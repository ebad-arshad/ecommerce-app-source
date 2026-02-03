/**
 * Middleware to verify the role of user
 */
module.exports = (role) =>
  (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  };