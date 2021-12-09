const express = require("express");
const userQueries = require("../queries/userQueries");

var router = express.Router();

// TODO: Registration view
router.get("/", (req, res, next) => {
  res.render("registration");
});

router.post("/", (req, res, next) => {
  (async () => {
    var result = await userQueries.createUser([
      req.body.username,
      req.body.password,
      req.body.email,
    ]);
    res.status(201);
  })();
});

module.exports = router;
