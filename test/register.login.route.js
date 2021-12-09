const userQueries = require("../queries/userQueries");
const postQueries = require("../queries/postQueries");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("User Registration and Login", () => {
  let testUser = {
    username: "testuser123",
    password: "testpassword123",
    email: "testuser@email.com",
  };
  let accessToken ;
  let refreshToken ; 

  // Saniranje prije i poslije testova za registraciju i login
  before(() => {
    userQueries.deleteUser([testUser.username]);
  });
  after(() => {
    userQueries.deleteUser([testUser.username]);
  });

  // Testiranje za registraciju
  describe("POST /register", () => {
    it("User tries to register.Data is sound, should be successful.", (done) => {
      // Šaljemo zahtjev na server za registraciju korisnika testUser
      chai
        .request(server)
        .post("/register")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it("User tries to register, but user already exists. Should fail and return 403.", (done) => {
      chai
        .request(server)
        .post("/register")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
  // Testiranje za login
  describe("POST /login", () => {
    it("User attempts to log-in with the correct information. Should return 200 OK + accessToken&refreshToken.\n\
      Return body should be JSON.", (done) => {
      let loginData = {
        username: testUser.username,
        password: testUser.password,
      };
      chai
        .request(server)
        .post("/login")
        .send(loginData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          accessToken = res.body.accessToken;
          done();
        });
    });
    it("User attempts to log-in with incorrect credentials. Should fail, return 401 Unauthorized(per RFC) and message.", (done) => {
      let loginData = {
        username: testUser.username,
        password: "wrongpassword123",
      };
      chai
        .request(server)
        .post("/login")
        .send(loginData)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe("POST /logout", () => {
    it(
      "Already logged in user attempts to log-out. He sends his JWT access token.", (done) => {
          chai.request(server).post("/logout").set("Authorization","Bearer: "+accessToken).send({token:accessToken})
      }
    );
  });
});
