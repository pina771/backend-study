const userQueries = require("../queries/userQueries");
const postQueries = require("../queries/postQueries");
require("./user.routes");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("Posts", () => {
  let testUser = {
    username: "testuser123",
    password: "testpassword123",
    email: "testuser@email.com",
  };
  let accessToken;
  let refreshToken;

  before(async () => {
    await userQueries.deleteUser(testUser.username);
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

  after(async () => {
    await userQueries.deleteUser(testUser.username); // NOTE: Will also delete the posts!
  });
  describe("GET /api/posts", () => {
    it("Get all posts of application", (done) => {
      chai
        .request(server)
        .get("/api/posts")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  describe("GET /api/posts/:postID", () => {
    it(
      "Get a specific post from the application. Should return 200 OK + JSON" +
        " with the post information",
      (done) => {
        chai
          .request(server)
          .get("/api/posts/2")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title");
            res.body.should.have.property("content");
            done();
          });
      }
    );
  });
  describe("POST /api/posts", () => {
    it("Authenticated user attempts to create a post on the application.Should return 201 Created", (done) => {
      chai
        .request(server)
        .post("/api/posts")
        .set("Authorization", "Bearer: " + accessToken)
        .send({ title: "Test-Post-Title", content: "Test-Post-Content" })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.have.header("Location");
          done();
        });
    });
    it("POST request is made without authentication. Should return 401 Unauthorized.", (done) => {
      chai
        .request(server)
        .post("/api/posts")
        .send({
          title: "Test-Post-Title-Without-Auth",
          content: "Test-Post-Content-Without-Auth",
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe("PUT /api/posts/:postId", () => {
    // Prije obavljanja ispitivanja stvaramo novu objavu koju ćemo urediti
    let postURL;
    before((done) => {
      chai
        .request(server)
        .post("/api/posts")
        .set("Authorization", "Bearer: " + accessToken)
        .send({ title: "Test-Post-Title", content: "Test-Post-Content" })
        .end((err, res) => {
          postURL = res.get("Location");
          done();
        });
    });
    it("User attempts to edit his own post. Should return 200 OK if succesfully edited.", (done) => {
      chai
        .request(server)
        .put(postURL)
        .set("Authorization", "Bearer: " + accessToken)
        .send({ title: "New-Title-Test", content: "New-Content-Test" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("DELETE /api/posts/:postID", () => {
    // Prije moramo stvoriti "dummy post"
    let postURL;
    before((done) => {
      chai
        .request(server)
        .post("/api/posts")
        .set("Authorization", "Bearer: " + accessToken)
        .send({ title: "Test-Post-Title", content: "Test-Post-Content" })
        .end((err, res) => {
          postURL = res.get("Location");
          done();
        });
    });

    it("Authorized user attempts to delete his own post. Should return 200 OK and delete the post.", (done) => {
      chai
        .request(server)
        .delete(postURL)
        .set("Authorization", "Bearer: " + accessToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
