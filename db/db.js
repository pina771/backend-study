// spajanje na bazu podataka
// NOTE: Ovdje bi tribalo napraviti zasebnu bazu podataka za testiranje i zasebnu za produkciju
// I onda na temelju enviromenta koristiti testiranje bazu ili produkcijsku

const Pool = require('pg').Pool
const pool = new Pool( {
    user: 'basicuser',
    host : 'localhost',
    database : 'api',
    password: 'password',
    port : 5432
});

module.exports = {
    query : (text,params) => {
        const start = Date.now();
        return pool.query(text,params)
            .then ( res => {
                const duration = Date.now() - start
                //console.log('executed query', {text, params, duration, rows: res.rows});
                return res;
            });
    },
    pool:pool
}