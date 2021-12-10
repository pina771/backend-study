const userQueries = require("../queries/userQueries");
const postQueries = require("../queries/postQueries");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);


describe("Posts", () => {
  describe("GET /posts", () => {
    it("Should GET all posts of application", (done) => {
      chai
        .request(server)
        .get("/api/posts")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    });
  });
});
