module.exports = (schema) =>
  async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body);
      next();
    }
    catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }