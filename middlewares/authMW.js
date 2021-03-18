const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = "secretvalue"

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};