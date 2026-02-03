module.exports = async (req, res, next) => {
  try {
    const userHeader = req.header("x-user");
    req.user = JSON.parse(userHeader);
    next();
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}