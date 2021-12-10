const db = require("../db/db");

async function getAllPosts(params) {
  const sql = `SELECT * from posts`;
  try {
    const result = await db.query(sql, []);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getPostById(params) {
  const sql = `SELECT * FROM posts WHERE post_id=($1)`;
  try {
    const result = await db.query(sql, [params]);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getPostsOfUser(params) {
  const sql = `SELECT * FROM posts WHERE username=($1)`;
  try {
    const result = await db.query(sql, [params]);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// NOTE:
// $1 = Title
// $2 = Content
// $3 = username
async function createNewPost(params) {
  const sql = `INSERT INTO posts VALUES (DEFAULT, ($1), ($2), DEFAULT, ($3), now()) RETURNING post_id`;
  try {
    const result = await db.query(sql, params);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// NOTE: Params
// $1 = postID
// $2 = new Title
// $3 = new Content

async function editPost(params) {
  const sql = `UPDATE posts SET title=($2), content=($3) WHERE post_id = ($1)`;
  try {
    const result = await db.query(sql, params);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deletePost(params) {
  const sql = `DELETE FROM posts WHERE post_id=($1)`;
  try {
    const result = await db.query(sql, [params]);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
module.exports = {
  getAllPosts,
  getPostById,
  getPostsOfUser,
  createNewPost,
  editPost,
  deletePost,
};
