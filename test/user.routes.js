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

  // Prije testiranja želimo stvoriti korisnika i ulogirati se u njega
  // da dobijemo accessToken za njega
  before(async () => {
    await userQueries
      .createUser([testUser.username, testUser.password, testUser.email])
      .then(
        chai
          .request(server)
          .post("/login")
          .send({ username: testUser.username, password: testUser.password })
          .end((err, res) => {
            accessToken = res.body.accessToken;
          })
      );
  });
  // Nakon želimo izbrisati korisnika
  after(async () => {
    await userQueries.deleteUser(testUser.username);
  });

  describe("GET /api/users", function () {
    it("Currently authenticated user tries to see all users. Should return 200 OK, and array in body.", (done) => {
      chai
        .request(server)
        .get("/api/users")
        .set("Authorization", "Bearer: " + accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /api/users/:username", function () {
    it(
      "Currently authenticated user tries to access his own profile. Should return" +
        " 200 OK + body=<JSONdata>",
      (done) => {
        chai
          .request(server)
          .get("/api/users/" + testUser.username)
          .set("Authorization", "Bearer: " + accessToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("username");
            res.body.should.have.property("email");
            res.body.should.not.have.property("password");
            done();
          });
      }
    );
  });

  describe("GET /api/users/:username/posts", function () {
    it("Attempts to get all posts of user specified in parameter. Should return 200 and array of objects.", (done) => {
      chai
        .request(server)
        .get("/api/users/pina771/posts")
        .set("Authorization", "Bearer: " + accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("PUT /api/users/:username", function () {
    it(
      "Currently authenticated & authorized user tries to edit his own profle info." +
        "Should return 200 OK if successful",
      (done) => {
        chai
          .request(server)
          .put("/api/users/" + testUser.username)
          .set("Authorization", "Bearer: " + accessToken)
          .send({ password: "newtestpassword123", email: "newemail123" })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      }
    );
    it("Current user attempts to change information of another user. Should return 403 Unauthorized", (done) => {
      chai
        .request(server)
        .put("/api/users/" + "randomUserThatsNotTest")
        .set("Authorization", "Bearer: " + accessToken)
        .send({ password: "newtestpassword123", email: "newemail123" })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    after(async () => {
      await userQueries.updateUser([
        testUser.username,
        testUser.password,
        testUser.email,
      ]);
    });
  });

  describe("DELETE /api/users/:username", function () {
    it(
      "Currently authenticated & authorized user attempts do delete his profile. Should return" +
        " 200 OK and a redirect to root address.",
      (done) => {
        chai
          .request(server)
          .delete("/api/users/" + testUser.username)
          .set("Authorization", "Bearer: " + accessToken)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      }
    );
    // Ako želimo daljnje testove, morat ćemo korisniak ponovo ubaciti u tablicu
    // i nastaviti testirat, no ovo je posljednji test
  });
});
