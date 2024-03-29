const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
