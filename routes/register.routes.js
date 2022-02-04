const express = require("express");
const userQueries = require("../queries/userQueries");

var router = express.Router();

router.get("/", (req, res, next) => {
  res.render("registration");
});

// REQ.body = JSON objekt 
// {username: <username> , password:<password>, email:<email>}
router.post("/", (req, res, next) => {
  (async () => {
    // NOTE: Obrati pažnju na poredak parametara, jer o tome ovisi redoslijed
    // upisa u bazu (mora biti neki bolji način!)
    var user = await userQueries.getUserByUsername(req.body.username);
    if (user[0] !== undefined) {
      return res.status(409).send("User already exists!");
    }
    var result = await userQueries.createUser([
      req.body.username,
      req.body.password,
      req.body.email,
    ]);
    return res.status(201).send("User succesfully created!");
  })();
});

module.exports = router;
