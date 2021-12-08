var express = require("express");
const userQueries = require("../queries/userQueries");
const postsQueries = require("../queries/postsQueries");

var router = express.Router();

// Dohvaća sve korisnike
router.get("/", (req, res, next) => {
  (async () => {
    var users = await userQueries.getAllUsers();
    console.log(users);
    res.status(200).json(users);
  })();
});

// Dohvaća specifičnog korisnika
router.get("/:username", (req, res, next) => {
  (async () => {
    var user = await userQueries.getUserByUsername(req.params.username);
    console.log(user);
    res.status(200).json(user);
  })();
});
router.delete("/:username", (req, res, next) => {
  (async () => {})();
});

// Stvara novog korisnika za taj URI (u tijelu su lozinka i email)
router.put("/:username", (req, res, next) => {
  (async () => {
    // console.log("PUT");
    // console.log("req.body.password=" + req.body.password);
    var result = await userQueries.createUser([
      req.params.username,
      req.body.password,
      req.body.email,
    ]);
    res.setHeader("Location","./"+req.params.username);
    res.status(201).send(result.rows);
  })();
});

// Dohvaća sve objave specifičnog korisnika
router.get("/:username/posts", (req, res, next) => {
  (async () => {
    // userQueries.getUserByUsername daje nazad polje JSON objekata, zato kasnije moram
    // izvuc korisnika kao user[0], jer znamo da je username UNIQUE pa moze biti samo jedan
    var user = await userQueries.getUserByUsername(req.params.username);
    var posts = await postsQueries.getPostsOfUser(user[0].username);
    res.status(200).json(posts);
  })();
});

// TODO: Dodati metodu
// Dodaje novu objavu za specifičnog korisnika
router.post("/users/:username/posts", (req, res, next) => {
  async () => {};
});

module.exports = router;
