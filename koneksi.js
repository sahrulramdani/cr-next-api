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

// server cloud production
const db = mysql.createConnection({
    host : '202.78.195.170',
    user : 'simz_user',
    password : 'simz@sps100%',
    database : 'db_simzdev'
});

/* const db = mysql.createConnection({
    host : '202.78.195.170',
    user : 'simz_user',
    password : 'simz@sps100%',
    database : 'db_simz'
}); */

// server development
/* const db = mysql.createConnection({
    host : '202.78.195.173',
    port : 5506,
    user : 'sisqu',
    password : 'admin@sisqu100%',
    database : 'db_sisqu_dev'
}); */

export default db;