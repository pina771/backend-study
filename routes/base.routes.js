const express = require("express");
const userQueries = require("../queries/userQueries");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

var router = express.Router();

const secret = process.env.TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokens = [];

router.get("/api", (req, res, next) => {
  res.render("api");
});
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  (async () => {
    var result = await userQueries.getLoginData([
      req.body.username,
      req.body.password,
    ]);
    var user = result[0];
    if (user === undefined) {
      res.status(401).send("User/password combination incorrect");
    } else {
      const accessToken = jwt.sign({ username: user.username }, secret, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ username: user.username }, refreshSecret);
      refreshTokens.push(refreshToken);
      res.json({ accessToken, refreshToken });
    }
  })();
});

router.post("/logout", (req, res, next) => {
  console.log("User is logging out, his refresh token will be destroyed");
  const token = req.body.token;
  refreshTokens = refreshTokens.filter((token) => t !== token);
  res.send("Logout successful");
});

// NOTE: Url za obnovu AccessTokena na temelju refresh tokena
router.post("/token", (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, refreshSecret, (err, result) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign({ username: result.username }, secret, {
      expiresIn: "2h",
    });
    res.json({ accessToken });
  });
});

module.exports = router;
