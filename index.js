const express = require("express");
var bodyParser = require("body-parser");
const usersRouter = require("./routes/user.routes");
const apiRouter = require("./routes/api.routes");
const app = express();

const PORT = process.env.PORT || 3000;

// Postavljamo da API može interpretirati www-urlencoded i JSON tijela
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", usersRouter);

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
