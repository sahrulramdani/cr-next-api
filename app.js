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

app.post('/saveSetup', function(req, res) {
    var sql = 'INSERT INTO tb00_basx SET ?';
    var data = {
        CODD_FLNM : req.body.CODD_FLNM,
        CODD_VALU : req.body.CODD_VALU,
        CODD_DESC : req.body.CODD_DESC 
    };

    db.query(sql, data, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.send({
                status: true
            });
        }
    });
});

// Save Unit/Entity
app.post('/saveUnit', function(req, res) {
    var sql = 'INSERT INTO tb00_unit SET ?';
    var data = {
        KODE_UNIT : req.body.KODE_UNIT,
        NAMA_UNIT : req.body.NAMA_UNIT,
        KETX_UNIT : req.body.KODE_UNIT
    };

    db.query(sql, data, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.send({
                status: true
            });
        }
    });
});

// Master RKAT Issue Header
app.get('/issues', (request, response) => {
    var qryCmd = "select ACCT_CODE as id, ACCT_NAMA, STATUS from tb50_rish";
    db.query(qryCmd, function(err, rows, fields) {
        response.send(rows);
    });
})

// save Master RKAT issue Header
app.post('/saveIssue', function(req, res) {
    var sql = 'INSERT INTO tb50_rish SET ?';
    var data = {
        ACCT_CODE : req.body.ACCT_CODE,
        ACCT_NAMA : req.body.ACCT_NAMA,
        STATUS : req.body.STATUS
    };

    db.query(sql, data, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.send({
                status: true
            });
        }
    });
});

// Issue Get ID
app.get('/issue/:id', function(req, res) {
    var ids = req.params.id;
    var sql = ' SELECT * FROM `tb50_rish` WHERE ACCT_CODE = "'+ ids +'" ';
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// Update Issue
app.post('/updateIssue', function(req, res) {
    var ids = req.body.ACCT_CODE;
    var sql = 'UPDATE `tb50_rish` SET ? WHERE ACCT_CODE = "'+ ids +'" ';
    var data = {
        ACCT_CODE : req.body.ACCT_CODE,
        ACCT_NAMA : req.body.ACCT_NAMA,
        STATUS : req.body.STATUS
    };

    db.query(sql, data, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.send({
                status: true
            });
        }
    });
});

// Delete Issue
app.post('/deleteIssue', function(req, res) {
    var selectedIds = [];
    console.log(req.body.selectedIds);
    selectedIds = parseComma(req.body.selectedIds);

    var arrayLength = selectedIds.length;
    var sql = 'delete from `tb50_rish` where ACCT_CODE in (';
    if (arrayLength > 0) {
        for(var i=0; i<arrayLength; i++) {
            if (i === 0) {
              sql += selectedIds[i];
            } else {
              sql += ',' + selectedIds[i];
            }
        } 

        sql += ')';

        db.query(sql, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {
                res.send({
                    status: true
                });
            }
        });
    } else {
        res.send({
            status: true
        });
    }
});

function parseComma(paramInput) {
    var output = [];
    var temp = [];
    temp = paramInput.split(';');
    console.log(temp);

    if (temp.length > 0) {
        output = temp;
    }

    return output;
}

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  });

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
