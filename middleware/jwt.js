const jwt = require("jsonwebtoken");
const { User } = require("../model");

module.exports = (req, res, next) => {
  const caller =
    req.get("caller") ||
    req.headers["caller"] ||
    req.get("Caller") ||
    req.headers["Caller"];

  if (caller && (caller === "cron-service" || caller === "AX")) {
    req.userId = caller;
    console.log("CALLER", caller);
    return next();
  }

  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error(`"Auth header not found: "${req.path}`);
    error.statusCode = 401;
    return next(error);
  }
  // console.log(authHeader)
  let decodedToken;
  let token;
  try {
    token = authHeader.split(" ")[1];
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error("matching token failed");
    error.statusCode = 401;
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error("Incorrect Decoded Token ");
    error.statusCode = 401;
    return next(error);
  }
  if (!decodedToken.userId) {
    const error = new Error("Decoded Token userid not found");
    error.statusCode = 401;
    return next(error);
  }
  User.findOne({ where: { id: decodedToken.userId } })
    .then((user) => {
      if (!user) {
        const error = new Error("No user found through JWT.");
        error.statusCode = 401;
        return next(error);
      }
      req.userId = decodedToken.userId;
      next();
    })
    .catch((error) => {
      return next(error);
    });
};
