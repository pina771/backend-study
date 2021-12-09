const db = require('../db/db')

async function getAllPosts(params){
    const sql = `SELECT * from posts`
    try {
        const result = await db.query(sql,[]);
        return result.rows
    } catch (err){
        console.log(err);
        throw err;
    }
} 
async function getPostsOfUser(params){
    const sql = `SELECT * FROM posts WHERE username=($1)`
    try {
        const result = await db.query(sql,[params]);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = {getAllPosts,getPostsOfUser}