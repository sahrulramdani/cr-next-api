const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_simzdev'
});

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(cors());

app.get('/', (request, response) => {
    response.json({ info: 'API SISQU' })
  })

  app.get('/pekerjaans', (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
  })

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
