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

    getGradeTL = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'GRADE_TL'"
    
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

    getAllCountry = (req, res) => {
      var sql = "SELECT a.* FROM countries a"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getAllStates = (req, res) => {
      var sql = `SELECT a.* FROM states a WHERE a.country_id = '${req.params.id}'`
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getAllCities = (req, res) => {
      var sql = `SELECT a.* FROM cities a WHERE a.state_id = '${req.params.id}'`
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getKompBiaya = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'JENIS_PBYA'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }
    
    getKategoriUser = (req, res) => {
      var sql = "SELECT CODD_FLNM, CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'KATX_USER'"
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getMusimBerjalan = (req, res) => {
      var sql = `SELECT a.KDXX_MUSM, DATE_FORMAT( a.AWAL_MUSM, "%d-%m-%Y" ) AS AWAL_MUSM, DATE_FORMAT( a.AKHR_MUSM, "%d-%m-%Y" ) AS AKHR_MUSM, STAS_MUSM FROM sett_musim a`
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }
    
    getAllMusim = (req, res) => {
      var sql = `SELECT a.KDXX_MUSM, DATE_FORMAT( a.AWAL_MUSM, "%d-%m-%Y" ) AS AWAL_MUSM, DATE_FORMAT( a.AKHR_MUSM, "%d-%m-%Y" ) AS AKHR_MUSM, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.CRTX_DATE BETWEEN a.AWAL_MUSM AND a.AKHR_MUSM ) AS PELANGGAN, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.STAS_BGKT = '1' AND b.CRTX_DATE BETWEEN a.AWAL_MUSM AND a.AKHR_MUSM ) AS BERANGKAT, STAS_MUSM FROM sett_musim a ORDER BY a.AWAL_MUSM DESC`
    
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    saveMusim = (req, res) => {
        var sqlInsert = "INSERT INTO sett_musim SET ?";
        var data = {
          AWAL_MUSM: req.body.AWAL_MUSM,
          AKHR_MUSM: req.body.AKHR_MUSM,
          STAS_MUSM: '0',
          CRTX_BYXX: "superadmin",
          CRTX_DATE: new Date(),
        }

        db.query(sqlInsert, data, (err, result) => {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: err.sqlMessage,
            });
          } else {
            res.send({
              status: true
            });
          }
        });
    }

    updateAktifMusim = (req,res) => {
      var sql = `UPDATE sett_musim SET STAS_MUSM = '0'`;

      db.query(sql, (err, result) => {
      if (err) {
          console.log(err);
          res.send({
          status: false,
          message: err.sqlMessage,
          });
      } else {
        var sql = `UPDATE sett_musim SET STAS_MUSM = '1' WHERE KDXX_MUSM = '${req.body.KDXX_MUSM}'`;
        db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
            status: false,
            message: err.sqlMessage,
            });
        } else {
            res.send({
            status: true
            });
        }
        });
      }
      });
    }
}