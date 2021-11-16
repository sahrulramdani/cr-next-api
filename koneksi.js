/* const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_simzdev'
});

module.exports = db; */

import mysql from 'mysql';

/* const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'admin',
    database : 'db_simzdev'
}); */

// server cloud SPS
const db = mysql.createConnection({
    host : '202.78.195.170',
    user : 'simz_user',
    password : 'simz@sps100%',
    database : 'db_simzdev'
});

export default db;