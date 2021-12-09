var express = require("express");
const postQueries = require("../queries/postQueries");

var router = express.Router();

router.get("/posts", (req, res, next) => {
  (async () => {
    var posts = await postQueries.getAllPosts();
    console.log(posts);
    res.status(200).json(posts);
  })();
});

// TODO: Stvaranje nove objave (u tijelu su username, title,content itd itd)
router.post("/posts", (req,res,next) => {

})
module.exports = router;
