const db = require("../db/db");

async function getAllUsers(params) {
  const sql = `SELECT * FROM users_no_pw`;
  try {
    const result = await db.query(sql, []);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUserByUsername(params) {
  const sql = "SELECT * FROM users_no_pw WHERE username = ($1)";
  try {
    const result = await db.query(sql, [params]);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getLoginData(params){
  const sql = "SELECT username,password FROM users WHERE username=($1) AND password=($2)"
  try {
    const result = await db.query(sql,params);
    return result.rows;
  } catch(err) {
    console.log(err);
    throw err;
  }
}

// poredak parametara :
// $1 = username
// $2 = password
// $3 = email
async function createUser(params) {
  const sql = "INSERT INTO USERS values (($1),($2),($3) )";
  try {
    const result = await db.query(sql, params);
    console.log("Test result = " + result);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteUser(params) {
  const sql = "DELETE FROM users WHERE username = ($1)";
  try {
    const result = await db.query(sql, params);
    console.log("Delete result = " + result);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function updateUser(params) {
  const sql =
    "UPDATE TABLE users SET password=($2),email=($3) WHERE username=($1)";
  try {
    const result = await db.query(sql, params);
    console.log("Update result =" + result);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getLoginData
};
