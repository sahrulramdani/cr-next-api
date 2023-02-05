import db from "./../../koneksi.js";
import GenerateNumber from "./../../libraries/sisqu/GenerateNumber.js";
import moment from "moment";
import { fncCheckProcCode } from "./../../libraries/local/localUtility.js";
import ApiWA from "./../../libraries/automate/apiWABlast.js";
import { config } from "./../../config.js";
import e from "express";
// import multer from "multer.js";
// import multer from "multer";
import fs from 'fs';
import { randomString } from './../../libraries/sisqu/Utility.js';
  
export default class Marketing {
  
  getAllAgency = (req, res) => {
    var sql = "SELECT a.* , IF( a.STAS_AGEN = '1', 'Aktif', 'Tidak Aktif' ) AS STATUS_AGEN, b.CODD_DESC AS FEE, c.CODD_DESC AS FIRST_LVL, d.NAMA_KNTR FROM mrkt_agensih a LEFT JOIN tb00_basx b ON a.FEEX_LVEL = b.CODD_VALU LEFT JOIN tb00_basx c ON a.FIRST_LVEL = c.CODD_VALU LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR";

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  };

  getCalonAgency = (req, res) => {
    var sql = "SELECT a.*, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX, IFNULL(f.KDXX_MRKT,'BUKAN') AS CEK FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT LEFT JOIN mrkt_agensih f ON a.NOXX_IDNT = f.NOXX_IDNT HAVING CEK = 'BUKAN'"

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getIDAgency = (req, res) => {
    var kode;
    var getLast = "SELECT MAX(KDXX_AGEN) AS LAST FROM mrkt_agensi";
  
    db.query(getLast, function (err, rows, fields){
        rows.map((data) => {
          if (data.LAST != null) {            
            var lastCode = data.LAST.slice(-5);
            var getNumberCode = parseInt(lastCode) + 1;
            var numberCode = String(getNumberCode).padStart(5, '0');
            kode = 'AGMR' + numberCode;  
          }else{
            kode = 'AGMR00001' 
          }
        });

        res.send(kode);
    })
  
  }

  saveAgency = (req, res) => {
    // --Mencari Data Leader
    var sql = `SELECT FIRST_LVEL FROM mrkt_agensih WHERE KDXX_MRKT = '${req.body.KDXX_LEAD}'`;

    db.query(sql, function (err, rows, fields) {
      // --Menentukan First level
      if (rows != '') {     
        var firstLvl = '';

        rows.map((data) => {
          if (data.FIRST_LEVL < 4804) {
            firstLvl = parseInt(data.FIRST_LEVL) + 1;
          }else{
            firstLvl = '4804'
          }
        })
      }else{
        var firstLvl = '4801';
      }

      // --Menyimpan Gambar
      var fotoAgency = req.body.FOTO_AGEN;
      if (fotoAgency != 'TIDAK') {        
        var fotoAgencyName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoAgencyName}`, fotoAgency, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaFoto = fotoAgencyName;
      }else{
        var namaFoto = req.body.FOTO_LMAX;
      }

      var fotoKtpAgen = req.body.FOTO_KTPX;
      if (fotoKtpAgen != 'TIDAK') {
        var fotoKtpAgenName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoKtpAgenName}`, fotoKtpAgen, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaKtp = fotoKtpAgenName
      }else{
        var namaKtp = req.body.KTPX_LMAX;
      }

      // --Menyimpan ke database
      var qryIns = 'INSERT INTO mrkt_agensih SET ?';
      var data = {
        KDXX_MRKT : req.body.KDXX_AGEN,
        NOXX_IDNT : req.body.NOXX_IDNT,
        NAMA_LGKP : req.body.NAMA_LGKP,
        JENS_KLMN : req.body.JENS_KLMN,
        TMPT_LHIR : req.body.TMPT_LHIR,
        TGLX_LHIR : req.body.TGLX_LHIR,
        ALAMAT : req.body.ALAMAT,
        KDXX_KNTR : req.body.KDXX_KNTR,
        KDXX_PROV : req.body.KDXX_PROV,
        KDXX_KOTA : req.body.KDXX_KOTA,
        KDXX_KECX : req.body.KDXX_KECX,
        KDXX_KELX : req.body.KDXX_KELX,
        KDXX_POSX : req.body.KDXX_POSX,
        KDXX_LEAD : req.body.KDXX_LEAD,
        FEEX_LVEL : req.body.FEEX_LVEL,
        FIRST_LVEL : firstLvl,
        NAMA_AYAH : req.body.NAMA_AYAH,
        NOXX_TELP : req.body.NOXX_TELP,
        JENS_MNKH : req.body.JENS_MNKH,
        JENS_PEND : req.body.JENS_PEND,
        JENS_PKRJ : req.body.JENS_PKRJ,
        FEEX_LVEL : req.body.FEEX_LVEL,
        FOTO_AGEN : namaFoto,
        FOTO_KTPX : namaKtp,
        STAS_AGEN : 1,
        PERD_JMAH : 0,
        TOTL_JMAH : 0,
        TOTL_POIN : 0,
        TGLX_GBNG : moment(new Date()).format('YYYY-MM-DD'),
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'sahrulramdani20'
      };
      
      db.query(qryIns, data, (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          // --Menyimpan data paspor jika ada
          if (req.body.NOXX_PSPR != '') {
            var qryPspr = 'INSERT INTO mrkt_agensip SET ?';
            var dataPspr = {
              KDXX_MRKT : req.body.KDXX_AGEN,
              NOXX_PSPR : req.body.NOXX_PSPR,
              NAMA_PSPR : req.body.NAMA_LGKP,
              KLUR_DIXX : req.body.KLUR_DIXX,
              TGLX_KLUR : req.body.TGLX_KLUR,
              TGLX_EXPX : req.body.TGLX_EXPX,
              CRTX_DATE : new Date(),
              CRTX_BYXX : 'sahrulramdani20'
            };
  
            db.query(qryPspr, dataPspr, (err, result) => {
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
          }else{
            res.send({
              status: true
            });
          }
        }
      });

    });
  }

  saveAgencyBank = (req, res) => {
    var id = req.body.KDXX_MRKT;
    var sql = `SELECT a.* FROM mrkt_agensir a WHERE a.KDXX_MRKT = '${id}'`;

    db.query(sql, function (err, rows, fields){
      if (rows != '') {     
        var qryUpd = `update mrkt_agensir set ? where KDXX_MRKT = '${req.body.KDXX_MRKT}'`;
        var dataUpd = {
            KDXX_MRKT : req.body.KDXX_MRKT,
            NOXX_REKX : req.body.NOXX_REKX,
            NAMA_REKX : req.body.NAMA_REKX,
            KDXX_BANK : req.body.KDXX_BANK,
            STAS_REKX : req.body.STAS_REKX,
            UPDT_DATE : new Date(),
            UPDT_BYXX : 'sahrulramdani20'
        }
                  
        db.query(qryUpd, dataUpd, (err, result) => {
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
      }else{
        var qryIns = 'INSERT INTO mrkt_agensir SET ?';

        var dataIns = {
          KDXX_MRKT : req.body.KDXX_MRKT,
          NOXX_REKX : req.body.NOXX_REKX,
          NAMA_REKX : req.body.NAMA_REKX,
          KDXX_BANK : req.body.KDXX_BANK,
          STAS_REKX : req.body.STAS_REKX,
          CRTX_DATE : new Date(),
          CRTX_BYXX : 'sahrulramdani20'
        };

          
        db.query(qryIns, dataIns, (err, result) => {
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
    })
  }

  updateAgency = (req, res) => {
    // --Mencari Data Leader
    var sql = `SELECT FIRST_LVEL FROM mrkt_agensih WHERE KDXX_MRKT = '${req.body.KDXX_LEAD}'`;

    db.query(sql, function (err, rows, fields) {
      // --Menentukan First level
      if (rows != '') {     
        var firstLvl = '';

        rows.map((data) => {
          if (data.FIRST_LEVL < 4804) {
            firstLvl = parseInt(data.FIRST_LEVL) + 1;
          }else{
            firstLvl = '4804'
          }
        })
      }else{
        var firstLvl = '4801';
      }

      // --Menyimpan Gambar
      var fotoLama = req.body.FOTO_LAMA;
      if (fotoLama != '') {
        if (req.body.FOTO_AGEN == 'TIDAK') {
          var namaFoto = fotoLama;
        }else{
          fs.unlink(`uploads/${fotoLama}`,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          });  

          var fotoAgen = req.body.FOTO_AGEN;
          var fotoAgenName = randomString(10) + Date.now() + '.png';
          fs.writeFile(`uploads/${fotoAgenName}`, fotoAgen, {encoding:'base64'}, function(err){
            if (err) {
              console.log(err);
            }else{
              console.log('berhasil');
            }
          });
          var namaFoto = fotoAgenName;
        }
      }else{
        if(req.body.FOTO_AGEN == 'TIDAK'){
          var namaFoto = '';
        }else{
          var fotoAgen = req.body.FOTO_AGEN;
          var fotoAgenName = randomString(10) + Date.now() + '.png';
          fs.writeFile(`uploads/${fotoAgenName}`, fotoAgen, {encoding:'base64'}, function(err){
            if (err) {
              console.log(err);
            }else{
              console.log('berhasil');
            }
          });
    
          var namaFoto = fotoAgenName;
        }
      }

      // Menyimpan KTP
      var ktpLama = req.body.KTPX_LAMA;
      if (ktpLama != '') {
        if (req.body.FOTO_KTPX == 'TIDAK') {
          var namaKtp = ktpLama;
        }else{
          fs.unlink(`uploads/${ktpLama}`,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          });  

          var fotoKtpAgen = req.body.FOTO_KTPX;
          var fotoKtpAgenName = randomString(10) + Date.now() + '.png';
          fs.writeFile(`uploads/${fotoKtpAgenName}`, fotoKtpAgen, {encoding:'base64'}, function(err){
            if (err) {
              console.log(err);
            }else{
              console.log('berhasil');
            }
          });
          var namaKtp = fotoKtpAgenName;
        }
      }else{
        if (req.body.FOTO_KTPX == 'TIDAK') {
          var namaKtp = '';
        } else {
          var fotoKtpAgen = req.body.FOTO_KTPX;
          var fotoKtpAgenName = randomString(10) + Date.now() + '.png';
          fs.writeFile(`uploads/${fotoKtpAgenName}`, fotoKtpAgen, {encoding:'base64'}, function(err){
            if (err) {
              console.log(err);
            }else{
              console.log('berhasil');
            }
          });
          var namaKtp = fotoKtpAgenName;
        }
      }

      // --Menyimpan ke database
      var qryUpdate = `UPDATE mrkt_agensih SET ? WHERE KDXX_MRKT = '${req.body.KDXX_AGEN}'`;
      var data = {
        KDXX_MRKT : req.body.KDXX_AGEN,
        NOXX_IDNT : req.body.NOXX_IDNT,
        NAMA_LGKP : req.body.NAMA_LGKP,
        JENS_KLMN : req.body.JENS_KLMN,
        TMPT_LHIR : req.body.TMPT_LHIR,
        TGLX_LHIR : req.body.TGLX_LHIR,
        ALAMAT : req.body.ALAMAT,
        KDXX_KNTR : req.body.KDXX_KNTR,
        KDXX_PROV : req.body.KDXX_PROV,
        KDXX_KOTA : req.body.KDXX_KOTA,
        KDXX_KECX : req.body.KDXX_KECX,
        KDXX_KELX : req.body.KDXX_KELX,
        KDXX_POSX : req.body.KDXX_POSX,
        KDXX_LEAD : req.body.KDXX_LEAD,
        FEEX_LVEL : req.body.FEEX_LVEL,
        FIRST_LVEL : firstLvl,
        NAMA_AYAH : req.body.NAMA_AYAH,
        NOXX_TELP : req.body.NOXX_TELP,
        JENS_MNKH : req.body.JENS_MNKH,
        JENS_PEND : req.body.JENS_PEND,
        JENS_PKRJ : req.body.JENS_PKRJ,
        FEEX_LVEL : req.body.FEEX_LVEL,
        FOTO_AGEN : namaFoto,
        FOTO_KTPX : namaKtp,
        STAS_AGEN : req.body.STAS_AGEN,
        TGLX_GBNG : moment(new Date()).format('YYYY-MM-DD'),
        UPDT_DATE : new Date(),
        UPDT_BYXX : 'sahrulramdani20'
      };
      
      db.query(qryUpdate, data, (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          if (req.body.NOXX_PSPR != '') {
            var cari = `SELECT * FROM mrkt_agensip WHERE KDXX_MRKT = '${req.body.KDXX_AGEN}'`;

            db.query(cari, function (err, rows, fields) {
              console.log('cari');
              if (rows != '') {     
                var updPass = `UPDATE mrkt_agensip SET ? where KDXX_MRKT = '${req.body.KDXX_MRKT}'`;
                var dataPass = {
                    KDXX_MRKT : req.body.KDXX_MRKT,
                    NOXX_PSPR : req.body.NOXX_PSPR,
                    NAMA_PSPR : req.body.NAMA_LGKP,
                    KLUR_DIXX : req.body.KLUR_DIXX,
                    TGLX_KLUR : req.body.TGLX_KLUR,
                    TGLX_EXPX : req.body.TGLX_EXPX,
                    UPDT_DATE : new Date(),
                    UPDT_BYXX : 'sahrulramdani20'
                }
  
                db.query(updPass, dataPass, (err, result) => {
                  console.log('update pass');
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
              }else{
                var qryPspr = 'INSERT INTO mrkt_agensip SET ?';
                var dataPspr = {
                  KDXX_MRKT : req.body.KDXX_AGEN,
                  NOXX_PSPR : req.body.NOXX_PSPR,
                  NAMA_PSPR : req.body.NAMA_LGKP,
                  KLUR_DIXX : req.body.KLUR_DIXX,
                  TGLX_KLUR : req.body.TGLX_KLUR,
                  TGLX_EXPX : req.body.TGLX_EXPX,
                  CRTX_DATE : new Date(),
                  CRTX_BYXX : 'sahrulramdani20'
                };
      
                db.query(qryPspr, dataPspr, (err, result) => {
                  console.log('insert pass');
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
              }}
            );
          }else{
            res.send({
              status: true
            });
          }
        }
      });

    });
  }


  deleteAgency = (req, res) => {
    var id = req.body.KDXX_AGEN;
    var sql = `delete from mrkt_agensi where KDXX_AGEN = '${id}'`;
    
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

  getDetailAgency = (req, res) => {
    var sql = `SELECT a.*, IF( a.STAS_AGEN = '1', 'Aktif', 'Tidak Aktif' ) AS STATUS_AGEN, b.CODD_DESC AS FEE, c.CODD_DESC AS FIRST_LVL, d.NAMA_KNTR, e.NAMA_LGKP AS UPLINE, f.CODD_DESC AS MENIKAH, g.CODD_DESC AS PENDIDIKAN, h.CODD_DESC AS PEKERJAAN, i.* FROM mrkt_agensih a LEFT JOIN tb00_basx b ON a.FEEX_LVEL = b.CODD_VALU LEFT JOIN tb00_basx c ON a.FIRST_LVEL = c.CODD_VALU LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR LEFT JOIN mrkt_agensih e ON a.KDXX_LEAD = e.KDXX_MRKT LEFT JOIN tb00_basx f ON a.JENS_MNKH = f.CODD_VALU LEFT JOIN tb00_basx g ON a.JENS_PEND = g.CODD_VALU LEFT JOIN tb00_basx h ON a.JENS_PKRJ = h.CODD_VALU LEFT JOIN mrkt_agensip i ON a.KDXX_MRKT = i.KDXX_MRKT WHERE a.KDXX_MRKT = '${req.params.id}'`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDetailPelangganAgency = (req, res) => {
    var sql = `SELECT a.KDXX_JMAH, a.STAS_BYAR, b.NAMA_LGKP, c.TGLX_BGKT, c.NAMA_PKET, c.JENS_PKET, IF( c.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS CEK, d.NAMA_KNTR FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.KDXX_JMAH LEFT JOIN mrkt_jadwalh c ON a.KDXX_PKET = c.KDXX_JDWL LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR WHERE a.KDXX_MRKT = '${req.params.id}'`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDetailBankAgency = (req, res) => {
    var sql = `SELECT a.*, b.CODD_DESC AS NAMA_BANK FROM mrkt_agensir a LEFT JOIN tb00_basx b ON a.KDXX_BANK = b.CODD_VALU WHERE b.CODD_FLNM = 'BANK' AND a.KDXX_MRKT = '${req.params.id}'`
    
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDetailDownlineAgency = (req, res) => {
    var sql = `SELECT a.*, b.CODD_DESC AS FEE, c.NAMA_KNTR FROM mrkt_agensih a LEFT JOIN tb00_basx b ON a.FEEX_LVEL = b.CODD_VALU LEFT JOIN hrsc_mkantorh c ON a.KDXX_KNTR = c.KDXX_KNTR WHERE a.KDXX_LEAD = '${req.params.id}'`
    
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }
}
