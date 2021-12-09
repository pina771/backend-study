const jwt = require("jsonwebtoken");
const secret = "elder-reflections-of-a-floating-world";
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, result) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.authInfo = result; // NOTE: U req.authInfo dobijamo vrijednost korisničkog imena
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT };
