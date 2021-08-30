/* const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_simzdev'
});

module.exports = db; */

import mysql from 'mysql';

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_simzdev'
});

export default db;