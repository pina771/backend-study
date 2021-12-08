const { response } = require("express");
var express = require("express");
var router = express.Router();
const postsQueries = require("../queries/postsQueries");


router.get("/", function (req, res, next) {
  res.json({ info: " Node.js,Express API testing" });
});



/**
 * Dohvaća sve objave
 */
router.get("/posts", (req, res, next) => {
  (async () => {
    var posts = await postsQueries.getAllPosts();
    console.log(posts);
    res.status(200).json(posts);
  })();
});
module.exports = router;
