const userQueries = require("../queries/userQueries");
const postQueries = require("../queries/postQueries");
require("./register.login.routes.js");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("User resource testing", function () {
  let testUser = {
    username: "testuser123",
    password: "testpassword123",
    email: "testuser@email.com",
  };
  let accessToken;
  let refreshToken;

  before(async () => {
    await userQueries.deleteUser(testUser.username);
    chai.request(server).post("/login")
    .send({username:testUser.username,password:testUser.password})
    .end((err,res) => {
        return;
    })
  });
  after(async () => {
    await userQueries.deleteUser(testUser.username);
  });

  // TODO: Završiti
  describe ("GET /api/users/:username", function () {
      it("Currently authenticated user tries to access his own profile. Should return\
      200 OK + body=<JSONdata>")

  })
});
