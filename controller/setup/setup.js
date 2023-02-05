import  db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';


export default class Setup {
    kantorAll = (req, res) => {
        var sql = "SELECT a.* FROM hrsc_mkantorh a";
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
      };

    getFeeLevel = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'FEELEVEL'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getStatusMenikah = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'MARRYXX'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPendidikan = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'PENDXX'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPekerjaan = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'PEKERJAAN'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getBankAll = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'BANK'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }
}