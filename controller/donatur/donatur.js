import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';

export default class Donatur {
    donaturs = (request, response) => {
        var status = request.params.status;

        var qryCmd = "";
        if (status === "0") {   // All Status kecuali New dan Send Back
            qryCmd = "select a.NO_ID as id, a.NAMA, " +
                     "CASE a.JNKX_KLMN " +
                        "WHEN '1' THEN 'Laki-laki' " +
                        "ELSE 'Perempuan' " +
                      "END As Jns_Kelamin, " + 
                      "a.Email, a.NoHP from tb11_mzjb a where a.Status <> '1' And a.Status <> '3'";
        } else {
            qryCmd = "select a.NO_ID as id, a.NAMA, " +
                     "CASE a.JNKX_KLMN " +
                        "WHEN '1' THEN 'Laki-laki' " +
                        "ELSE 'Perempuan' " +
                      "END As Jns_Kelamin, " + 
                      "a.Email, a.NoHP from tb11_mzjb a where a.Status = '" + status + "'";
        };
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    idDonaturs = (request, response) => {
        var status = request.params.status

        var qryCmd = "";
        if (status === "0") {
            // All, kecuali New dan Send Back
            qryCmd = "select NO_ID As value, CONCAT(`NO_ID`, ' - ', `NAMA`, ' - ', SUBSTRING(`ALMT_XXX1`, 1, 20)) As label from tb11_mzjb where Status <> '1' And Status <> '3' order by NO_ID";
        } else {
            qryCmd = "select NO_ID As value, CONCAT(`NO_ID`, ' - ', `NAMA`, ' - ', SUBSTRING(`ALMT_XXX1`, 1, 20)) As label from tb11_mzjb where Status = '" + status + "'  order by NO_ID";
        }
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    getDonatur = function(req, res) {
        var id = req.params.id;

        var sql = 'SELECT * FROM tb11_mzjb WHERE NO_ID = "'+ id +'"';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    getDonatursPerLevel = function(req, res) {
        var level = req.params.level;
        var sql = '';

        if (level === 'P') { // Donatur Platinum
            sql = 'SELECT * FROM tb11_mzjb WHERE FlgPlatinum = "1"';
        } else {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, '%e-%b-%Y') As TglMasuk FROM tb11_mzjb a inner join (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") b on a.TypeDonatur = b.CODD_VALU WHERE b.CODD_VARC >= "'+ level + '" ORDER BY a.NAMA';
        }
        
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    saveDonatur = function(req, res) {
        var sql = 'INSERT INTO tb11_mzjb SET ?';
        var data = {
            NO_ID : req.body.NO_ID,
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum,
            Channel : req.body.Channel
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    updateDonatur = function(req, res) {
        var id = req.body.NO_ID;

        var sql = 'UPDATE tb11_mzjb SET ? WHERE NO_ID = "' + id + '"';
        var data = {
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum,
            Channel : req.body.Channel
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    verify = function(req, res) {
        var status = req.body.Status;
        var typeDonatur = req.body.TypeDonatur;

        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
        var arrayLength = selectedIds.length;

        var sql = 'UPDATE tb11_mzjb SET Status = "' + status + ', TypeDonatur = "' + typeDonatur + '" WHERE NO_ID in (';
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

    saveMasterFile = function(req, res) {
        var sql = 'INSERT INTO tb52_0001 SET ?';   // Tabel Master File Type Program Donatur
        var data = {
            FileName : req.body.FileName,
            FilePath : req.body.FilePath,
            Nama : req.body.Nama,
            TypeProgram : req.body.TypeProgram,
            TahunBuku : req.body.TahunBuku,
            Unit : req.body.Unit
        };

        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                //update File Path to /download/:id
                sql = 'update tb52_0001 set FilePath = CONCAT(FilePath, LAST_INSERT_ID()) where id = LAST_INSERT_ID()';
                db.query(sql, (err2, result2) => {
                    res.send({
                        status: true
                    });
                });
            }
        });
    } 

    getMasterFiles = (request, response) => {
        var typeProgram = request.params.typeProgram;
        var tahunBuku = request.params.tahunBuku;

        var qryCmd = "select * from tb52_0001 where TypeProgram = '" + typeProgram + "' And TahunBuku = '" + tahunBuku + "'";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    saveTransSLP = function(req, res) {
        var sql = 'INSERT INTO tb52_slpa SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            tglProses : req.body.tglProses,
            typeProgram : req.body.typeProgram,
            status : req.body.status,
            tahunBuku : req.body.tahunBuku,
            unit : req.body.unit
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    } 

    // Save Detail Transaksi SLP Attachments
    saveDetTransSLP1 = function(req, res) {
        var sql = 'INSERT INTO tb52_slpb SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            fileID : req.body.fileID
            
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    } 

    // get Transaksi SLP Detail Attachments
    getSLPAttachments = function(req, res) {
        var transNumber = req.params.transNumber;

        var sql = 'SELECT a.*, b.FileName FROM tb52_slpb a inner join tb52_0001 b on a.FileID = b.id  WHERE a.transNumber = "'+ transNumber +'"';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    deleteSLPAttachment = function(req, res) {
        var id = req.body.id;
        
        var sql = "delete from `tb52_slpb` where id = " + id;
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

    // Save Detail Transaksi SLP Donaturs
    saveDetTransSLP2 = function(req, res) {
        var sql = 'INSERT INTO tb52_slpc SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            donaturID : req.body.donaturID
            
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    } 

    // get Transaksi SLP Detail Donaturs
    getSLPDonaturs = function(req, res) {
        var transNumber = req.params.transNumber;

        var sql = 'SELECT a.*, b.NAMA FROM tb52_slpc a inner join tb11_mzjb b on a.donaturID = b.NO_ID  WHERE a.transNumber = "'+ transNumber +'"';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    deleteSLPDonatur = function(req, res) {
        var id = req.body.id;
        
        var sql = "delete from `tb52_slpc` where id = " + id;
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

    transSLPAll = (request, response) => {
        var qryCmd = "select a.*, DATE_FORMAT(a.tglProses, '%Y/%m/%d') As tglProsesFormat, b.CODD_DESC As TypeProgram2 from tb52_slpa a inner join (select * from tb00_basx where CODD_FLNM = 'TYPE_PROGRAM_DONATUR') b on a.typeProgram = b.CODD_VALU order by a.transNumber";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    deleteTransSLP = function(req, res) {
        var transNumber = req.body.id;
        
        var sql = "delete from `tb52_slpa` where transNumber = '" + transNumber + "'";
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

    getTransSLP = function(req, res) {
        var transNumber = req.params.id;

        var sql = 'SELECT a.*, c.CODD_VARC As Level FROM tb52_slpa a INNER JOIN (select * from tb00_basx where CODD_FLNM = "TYPE_PROGRAM_DONATUR") b ON a.typeProgram = b.CODD_VALU LEFT JOIN (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") c ON b.CODD_VARC = c.CODD_DESC WHERE a.transNumber = "'+ transNumber +'"';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    updateTransSLP = function(req, res) {
        var transNumber = req.body.transNumber;
        var sql = 'UPDATE tb52_slpa SET ? WHERE transNumber = "' + transNumber + '"';   
        var data = {
            tglProses : req.body.tglProses,
            typeProgram : req.body.typeProgram,
            status : req.body.status,
            tahunBuku : req.body.tahunBuku,
            unit : req.body.unit
        };

        db.query(sql, data, (err2, result2) => {
            if (err2) {
                console.log('Error', err2);

                res.send({
                    status: false,
                    message: err2.sqlMessage
                });
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    masterFileAll = (request, response) => {
        var qryCmd = "select a.*, b.CODD_DESC As TypeProgram2 from tb52_0001 a inner join (select * from tb00_basx where CODD_FLNM = 'TYPE_PROGRAM_DONATUR') b on a.typeProgram = b.CODD_VALU order by a.id desc";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }
}