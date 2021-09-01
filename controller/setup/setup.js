import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';


export default class Setup {
    pekerjaanAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN' order by CODD_DESC";
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

    typeRelawanAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_RELAWAN'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    unitAll = (request, response) => {
        var qryCmd = "select * from tb00_unit";
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

    statusMaritalAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'MARY_PART'";
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
                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    deleteSetup = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);

        var category = req.body.CODD_FLNM;
    
        var arrayLength = selectedIds.length;
        var sql = "delete from `tb00_basx` where CODD_FLNM = '" + category + "' And CODD_VALU in (";
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

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    deleteUnit = function(req, res) {
        var id = req.body.KODE_UNIT;
        var sql = "delete from `tb00_unit` where KODE_UNIT = '" + id + "'";

        db.query(sql, (err, result) => {
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