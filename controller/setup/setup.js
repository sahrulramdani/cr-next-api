import  db from './../../koneksi.js';

export default class Setup {
    pekerjaanAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    pendidikanAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PENDIDIKAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    wilayahKerjaAll = (request, response) => {
        var qryCmd = "select * from tb20_area";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    unitAll = (request, response) => {
        var qryCmd = "select * from tb00_lokx";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    locationAll = (request, response) => {
        var qryCmd = "select * from tb00_lokx";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    bussinessUnitAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BUSSINESS_UNIT'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    kelompokKerjaAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KELOMPOK_KERJA'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    saveSetup = function(req, res) {
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
    }

    saveUnit = function(req, res) {
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
    }

}