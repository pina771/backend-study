const express = require("express");
const jwt = require("jsonwebtoken");
const userQueries = require("../queries/userQueries");

var router = express.Router();

// TODO: Set secret in .ENV variable
const secret = "elder-reflections-of-a-floating-world";

router.get("/", (req, res, next) => {
  res.render("login");
});

router.post("/", (req, res, next) => {
  (async () => {
    var result = await userQueries.getLoginData([
      req.body.username,
      req.body.password
    ]);
    var user=result[0];
    if (user === undefined ) {
        res.status(401).send("User/password combination incorrect")
    } else {
        const accessToken = jwt.sign( {username:user.username},secret);
        res.json({accessToken});
    }
  })();
});

module.exports = router;
