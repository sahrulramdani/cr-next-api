/* const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_simzdev'
});

module.exports = db; */

import mysql from "mysql";

/* const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'admin',
    database : 'db_simzdev'
}); */

// server cloud production
// const db = mysql.createConnection({
//     host : '202.78.195.170',
//     user : 'simz_user',
//     password : 'simz@sps100%',
//     database : 'db_simzdev'
// });

/* const db = mysql.createConnection({
    host : '202.78.195.170',
    user : 'simz_user',
    password : 'simz@sps100%',
    database : 'db_simz'
}); */

// server development
// const db = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root", //sps
//     password: "sps@c@h@y@r100%", //spscr@udh@h100%
//     database: "db_craudhah",
//   });

  
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "db_cahayaraudhah",
});

// const db = mysql.createConnection({
//     host : 'localhost',
//     port : 4406,
//     user : 'root',
//     password : 'formed',
//     database : 'pte_projman'
// });

export default db;
