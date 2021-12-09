var express = require("express");
const userQueries = require("../queries/userQueries");
const postQueries = require("../queries/postQueries");
const { authenticateJWT } = require("../auth/auth");

var router = express.Router();

// Dohvaća sve korisnike
router.get("/", (req, res, next) => {
  (async () => {
    var users = await userQueries.getAllUsers();
    console.log(users);
    res.status(200).json(users);
  })();
});

// Dohvaća informacije o korisniku, (korisnik mora biti autoriziran )
router.get("/:username", authenticateJWT, (req, res, next) => {
  (async () => {
    if (req.authInfo.username == req.params.username) {
      var user = await userQueries.getUserByUsername(req.params.username);
      console.log(user);
      res.status(200).json(user);
    } else {
      res.status(401).send("Unauthorized");
    }
  })();
});


router.delete("/:username", authenticateJWT, (req, res, next) => {
  (async () => {
    if (req.authInfo.username == req.params.username) {
      var result = await userQueries.deleteUser([req.params.username]);
      res.redirect(200, "../login");
    } else {
      res.status(401).send("Unauthorized!");
    }
  })();
});

// Dohvaća sve objave specifičnog korisnika
router.get("/:username/posts", (req, res, next) => {
  (async () => {
    // userQueries.getUserByUsername daje nazad polje JSON objekata, zato kasnije moram
    // izvuc korisnika kao user[0], jer znamo da je username UNIQUE pa moze biti samo jedan
    var user = await userQueries.getUserByUsername(req.params.username);
    var posts = await postQueries.getPostsOfUser(user[0].username);
    res.status(200).json(posts);
  })();
});


module.exports = router;
