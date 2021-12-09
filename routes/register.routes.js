const express = require("express");
const userQueries = require("../queries/userQueries");

var router = express.Router();

// TODO: Registration View
router.get("/", (req, res, next) => {
  res.render("registration");
});

router.post("/", (req, res, next) => {
  (async () => {
    // NOTE: Obrati pažnju na poredak parametara, jer o tome ovisi redoslijed
    // upisa u bazu (mora biti neki bolji način!)
    var result = await userQueries.createUser([
      req.body.username,
      req.body.password,
      req.body.email,
    ]);
    res.status(201).send("User succesfully created!");
  })();
});

module.exports = router;
