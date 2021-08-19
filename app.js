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

  // Setup Pekerjaan
  app.get('/pekerjaans', (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
  })

  // Setup Pendidikan
  app.get('/pendidikans', (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PENDIDIKAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    })

  // Setup Wilayah Kerja
  app.get('/wilayah-kerjas', (request, response) => {
        var qryCmd = "select * from tb20_area";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    })

  // Setup Unit
  app.get('/units', (request, response) => {
    var qryCmd = "select * from tb00_unit";
    db.query(qryCmd, function(err, rows, fields) {
        response.send(rows);
    });
})

   // Setup Location (Unit)
  app.get('/locations', (request, response) => {
    var qryCmd = "select * from tb00_lokx";
    db.query(qryCmd, function(err, rows, fields) {
        response.send(rows);
    });
})

  // Setup Bussiness Unit
  app.get('/bussiness-units', (request, response) => {
    var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BUSSINESS_UNIT'";
    db.query(qryCmd, function(err, rows, fields) {
        response.send(rows);
    });
})

  // Setup Kelompok Kerja
  app.get('/kelompok-kerjas', (request, response) => {
    var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KELOMPOK_KERJA'";
    db.query(qryCmd, function(err, rows, fields) {
        response.send(rows);
    });
})

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
