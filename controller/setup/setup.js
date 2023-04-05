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

    getKamarAll = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'JENIS_KAMAR'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPlusTujuan = (req, res) => {
      var sql = "SELECT a.* FROM xxxx_masterdata a WHERE a.KDXX_FLNM = 'PLUS_TJUAN'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getJenisBiaya = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'JENIS_BIAYA'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getBiayaPaspor = (req, res) => {
      var sql = "SELECT a.* FROM sett_biaya a WHERE a.JENS_BYAX = '7704'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getBiayaVaksin = (req, res) => {
      var sql = "SELECT a.* FROM sett_biaya a WHERE a.JENS_BYAX = '7705'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getBiayaAdmin = (req, res) => {
      var sql = "SELECT a.* FROM sett_biaya a WHERE a.JENS_BYAX = '7702' AND a.NAMA_BYAX LIKE '%Admin'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getBiayaKamar = (req, res) => {
      var sql = "SELECT a.* FROM sett_biaya a WHERE a.JENS_BYAX = '7706'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getKategoriAccount = (req, res) => {
      var sql = "SELECT a.* FROM finc_kategori_coa a"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }
    
}