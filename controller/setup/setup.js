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
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PENDIDIKAN' order by CODD_VALU";
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
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_RELAWAN' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    typeDonaturAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_DONATUR' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    typeProgramDonaturAll = (request, response) => {
        var qryCmd = "select a.*, " + 
                      "Case a.CODD_VARC " +
                          "WHEN 'PLATINUM' Then 'P' "  +
                          "ELSE b.CODD_VARC " +
                       "End As Level " +
                       "from tb00_basx a left join (select * from tb00_basx where CODD_FLNM = 'TYPE_DONATUR') b on a.CODD_VARC = b.CODD_DESC where a.CODD_FLNM = 'TYPE_PROGRAM_DONATUR' order by a.CODD_VALU";
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

    getUnit = function(req, res) {
        var id = req.params.id;
        var sql = 'SELECT * FROM `tb00_unit` WHERE KODE_UNIT = "'+ id +'" ';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    locationAll = (request, response) => {
        var qryCmd = "select * from tb00_lokx";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    bussinessUnitAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BUSSINESS_UNIT' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    kelompokKerjaAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KELOMPOK_KERJA' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    statusMaritalAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'MARY_PART' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    channelDonaturAll = (request, response) => {
        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    saveSetup = function(req, res) {
        var sql = 'INSERT INTO tb00_basx SET ?';
        var data = {
            CODD_FLNM : req.body.CODD_FLNM,
            CODD_VALU : req.body.CODD_VALU,
            CODD_DESC : req.body.CODD_DESC,
            CODD_VARC : req.body.CODD_VARC 
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
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            KODE_URUT : req.body.KODE_URUT,
            Active : req.body.Active
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

    updateUnit = function(req, res) {
        var id = req.params.id;
        var sql = 'UPDATE tb00_unit SET ? WHERE KODE_UNIT = "' + id + '"';
        var data = {
            KODE_UNIT : req.body.KODE_UNIT,
            NAMA_UNIT : req.body.NAMA_UNIT,
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            KODE_URUT : req.body.KODE_URUT,
            Active : req.body.Active
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