import  db from './../../koneksi.js';

export default class Utility {
    getSequence = function(req, res) {
        var initial = req.params.initial;
        var tahun = req.params.tahun;

        var bussCode;
        if (req.params.bussCode === null || req.params.bussCode === undefined || req.params.bussCode === 'null') {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.params.bussCode;
        }

        var sql = 'select a.*, b.SequenceUnitCode from tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Initial = "' + initial + '" And a.BUSS_CODE = "' + bussCode + '" And a.Tahun = "' + tahun + '"'; 
        
        db.query(sql, (err, rows) => {
            res.send(rows);
        }); 
    }

    saveSequence = function(req, res) {
        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var sql = 'INSERT INTO tblsequence SET ?';
        var data = {
            Initial : req.body.Initial,
            BUSS_CODE : bussCode,
            Tahun : req.body.Tahun,
            SequenceUnitCode : req.SequenceUnitCode0,
            NOXX_URUT : req.body.NOXX_URUT,
            TGLX_PROC : new Date()
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

    updateSequence = function(req, res) {
        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var sql = "update tblsequence set NOXX_URUT = '" + req.body.NOXX_URUT + "' where Initial = '" + req.body.Initial + "' And BUSS_CODE = '" + bussCode + "' And Tahun = '" + req.body.Tahun + "'";

        db.query(sql, (err, result) => {
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
}