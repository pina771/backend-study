const express = require("express");
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const usersRouter = require("./routes/user.routes");
const postsRouter = require("./routes/post.routes");
const registerRouter = require("./routes/register.routes");
const baseRouter = require("./routes/base.routes");

const app = express();

const PORT = process.env.PORT || 3000;

const secret = "elder-reflections-of-a-floating-world";

// Postavljamo da API može interpretirati www-urlencoded i JSON tijela
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router setup
app.get("/api", (req, res, next) => {
  res.render("api");
});
app.use("/", baseRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/register", registerRouter);

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
module.exports = app;
