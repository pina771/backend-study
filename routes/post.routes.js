var express = require("express");
const postQueries = require("../queries/postQueries");
const { authenticateJWT } = require("../auth/auth");

var router = express.Router();

// Dohvat svih objava u aplikaciji
router.get("/", (req, res, next) => {
  (async () => {
    var posts = await postQueries.getAllPosts();
    res.status(200).json(posts);
  })();
});

router.post("/", authenticateJWT, (req, res, next) => {
  (async () => {
    var result = await postQueries.createNewPost([
      req.body.title,
      req.body.content,
      req.authInfo.username,
    ]);
    return res
      .setHeader("Location", req.originalUrl + "/" + result[0].post_id)
      .sendStatus(201);
  })();
});

router.get("/:postId", (req, res, next) => {
  (async () => {
    var result = await postQueries.getPostById(req.params.postId);
    if (result === undefined) res.status(404);
    else {
      res.status(200).send(result[0]);
    }
  })();
});

router.put("/:postId", authenticateJWT, (req, res, next) => {
  (async () => {
    // Prvo treba pronaći objavu
    var post = await postQueries.getPostById(req.params.postId);
    if (post[0] === undefined) {
      res.status(404).send("No such post!"); // Ako ne pronađe se objava, 404 Not Found
    } else {
      if (post[0].username !== req.authInfo.username) {
        // Ako nije autoriziran , 401 Unauthorized!
        res.status(403).send("User not authorized to edit this post!");
      } else {
        // Ako je objava pronađena I korisnik je onaj koji ju je stvorio
        var result = await postQueries.editPost([
          req.params.postId,
          req.body.title,
          req.body.content,
        ]);
        res.sendStatus(200);
      }
    }
  })();
});

router.delete("/:postId", authenticateJWT, (req, res, next) => {
  (async () => {
    var post = await postQueries.getPostById(req.params.postId);
    if (post[0] === undefined) {
      res.status(404).send("Post not found!");
    } else {
      if (post[0].username !== req.authInfo.username) {
        res.status(403).send("User not authorized to delete this post!");
      } else {
        var result = await postQueries.deletePost(req.params.postId);
        res.status(200).send("Post successfully deleted!");
      }
    }
  })();
});
module.exports = router;
