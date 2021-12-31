import  db from './../../koneksi.js';
import moment from 'moment';

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
        var bussCode = req.body.BUSS_CODE;
        if (req.body.BUSS_CODE === undefined) {
            bussCode = null;
        } 

        var sql = 'INSERT INTO tblsequence (Initial, BUSS_CODE, Tahun, SequenceUnitCode, NOXX_URUT, TGLX_PROC) select "' + req.body.Initial + '", IFNULL(' + bussCode + ', a.BUSS_CODE),' + req.body.Tahun + ', b.SequenceUnitCode,"' + req.body.NOXX_URUT + '","' + moment(new Date()).format('YYYY-MM-DD') +  '" from tb01_lgxh a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where UPPER(a.USER_IDXX) = "' + req.userID.toUpperCase() + '"';
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                if (bussCode === null) {
                    sql = 'update tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb01_lgxh c on b.KODE_UNIT = c.BUSS_CODE set a.SequenceUnitCode = b.SequenceUnitCode where a.Initial = "' + req.body.Initial + '" And a.Tahun = "' + req.body.Tahun + '" And UPPER(c.USER_IDXX) = "' + req.userID.toUpperCase() + '"';
                } else {
                    sql = 'update tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT set a.SequenceUnitCode = b.SequenceUnitCode where a.Initial = "' + req.body.Initial + '" And a.Tahun = "' + req.body.Tahun + '" And a.BUSS_CODE = "' + bussCode + '"';
                }

                db.query(sql, (err, result) => {
                    res.send({
                        status: true
                    });
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