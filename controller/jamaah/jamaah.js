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
import date from 'date-and-time';
import { fncParseComma, randomString } from './../../libraries/sisqu/Utility.js';
  
export default class Jamaah {
    getAllJamaah = (req, res) => {
        var sql = `SELECT a.*, TIMESTAMPDIFF(year,a.TGLX_LHIR,CURDATE()) AS UMUR, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT`;
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    };

    getDetailJamaah = (req, res) => {
      var sql = `SELECT a.*, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT WHERE a.NOXX_IDNT = '${req.params.id}'`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    saveJamaah = (req, res) => {
      var fotoJamaah = req.body.FOTO_JMAH;
      if (fotoJamaah != 'TIDAK') {        
        var fotoJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaFoto = fotoJamaahName;
      }else{
        var namaFoto = '';
      }

      var fotoKtpJamaah = req.body.FOTO_KTPX;
      if (fotoKtpJamaah != 'TIDAK') {
        var fotoKtpJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaKtp = fotoKtpJamaahName
      }else{
        var namaKtp = '';
      }

      var qryIns = 'INSERT INTO jmah_jamaahh SET ?';
      var data = {
        NOXX_IDNT : req.body.NOXX_IDNT,
        NAMA_LGKP : req.body.NAMA_LGKP,
        JENS_KLMN : req.body.JENS_KLMN,
        TMPT_LHIR : req.body.TMPT_LHIR,
        TGLX_LHIR : req.body.TGLX_LHIR,
        ALAMAT : req.body.ALAMAT,
        KDXX_PROV : req.body.KDXX_PROV,
        KDXX_KOTA : req.body.KDXX_KOTA,
        KDXX_KECX : req.body.KDXX_KECX,
        KDXX_KELX : req.body.KDXX_KELX,
        KDXX_POSX : req.body.KDXX_POSX,
        NAMA_AYAH : req.body.NAMA_AYAH,
        NOXX_TELP : req.body.NOXX_TELP,
        JENS_MNKH : req.body.JENS_MNKH,
        JENS_PEND : req.body.JENS_PEND,
        JENS_PKRJ : req.body.JENS_PKRJ,
        FOTO_JMAH : namaFoto,
        FOTO_KTPX : namaKtp,
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
            var qryPspr = 'INSERT INTO jmah_jamaahp SET ?';
            var dataPspr = {
              NOXX_IDNT : req.body.NOXX_IDNT,
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
  };

  updateJamaah = (req, res) => {
    // FOTO LAMA JAMAAH
    var fotoLama = req.body.FOTO_LAMA;
    if (fotoLama != '') {
      if (req.body.FOTO_JMAH == 'TIDAK') {
        var namaFoto = fotoLama;
      }else{
        fs.unlink(`uploads/${fotoLama}`,function(err){
          if(err) return console.log(err);
          console.log('file deleted successfully');
        });  

        var fotoJamaah = req.body.FOTO_JMAH;
        var fotoJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaFoto = fotoJamaahName;
      }
    }else{
      if(req.body.FOTO_JMAH == 'TIDAK'){
        var namaFoto = '';
      }else{
        var fotoJamaah = req.body.FOTO_JMAH;
        var fotoJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
  
        var namaFoto = fotoJamaahName;
      }
    }

    // FOTO KTP LAMA JAMAAH
    var ktpLama = req.body.KTPX_LAMA;
    if (ktpLama != '') {
      if (req.body.FOTO_KTPX == 'TIDAK') {
        var namaKtp = ktpLama;
      }else{
        fs.unlink(`uploads/${ktpLama}`,function(err){
          if(err) return console.log(err);
          console.log('file deleted successfully');
        });  

        var fotoKtpJamaah = req.body.FOTO_KTPX;
        var fotoKtpJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaKtp = fotoKtpJamaahName;
      }
    }else{
      if (req.body.FOTO_KTPX == 'TIDAK') {
        var namaKtp = '';
      } else {
        var fotoKtpJamaah = req.body.FOTO_KTPX;
        var fotoKtpJamaahName = randomString(10) + Date.now() + '.png';
        fs.writeFile(`uploads/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log(err);
          }else{
            console.log('berhasil');
          }
        });
        var namaKtp = fotoKtpJamaahName;
      }
    }

    var qryUpdate = `UPDATE jmah_jamaahh SET ? WHERE NOXX_IDNT = '${req.body.NOXX_IDNT}'`;
    var data = {
      NOXX_IDNT : req.body.NOXX_IDNT,
      NAMA_LGKP : req.body.NAMA_LGKP,
      JENS_KLMN : req.body.JENS_KLMN,
      TMPT_LHIR : req.body.TMPT_LHIR,
      TGLX_LHIR : req.body.TGLX_LHIR,
      ALAMAT : req.body.ALAMAT,
      KDXX_PROV : req.body.KDXX_PROV,
      KDXX_KOTA : req.body.KDXX_KOTA,
      KDXX_KECX : req.body.KDXX_KECX,
      KDXX_KELX : req.body.KDXX_KELX,
      KDXX_POSX : req.body.KDXX_POSX,
      NAMA_AYAH : req.body.NAMA_AYAH,
      NOXX_TELP : req.body.NOXX_TELP,
      JENS_MNKH : req.body.JENS_MNKH,
      JENS_PEND : req.body.JENS_PEND,
      JENS_PKRJ : req.body.JENS_PKRJ,
      FOTO_JMAH : namaFoto,
      FOTO_KTPX : namaKtp,
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
          var cari = `SELECT * FROM jmah_jamaahp WHERE NOXX_IDNT = '${req.body.NOXX_IDNT}'`;

          db.query(cari, function (err, rows, fields) {
            if (rows != '') {     
              var updPass = `UPDATE jmah_jamaahp SET ? where NOXX_IDNT = '${req.body.NOXX_IDNT}'`;
              var dataPass = {
                  NOXX_IDNT : req.body.NOXX_IDNT,
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
              var qryPspr = 'INSERT INTO jmah_jamaahp SET ?';
              var dataPspr = {
                NOXX_IDNT : req.body.NOXX_IDNT,
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
  }

  deleteJamaah = (req, res) => {
    var cari = `SELECT * FROM jmah_jamaahh WHERE NOXX_IDNT = '${req.body.NOXX_IDNT}'`;

    db.query(cari, function (err, rows, fields) {
      rows.map((data) => {
        if (data['FOTO_JMAH'] != '') {
          fs.unlink(`uploads/${data['FOTO_JMAH']}`,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          }); 
        }

        if (data['FOTO_KTPX'] != '') {
          fs.unlink(`uploads/${data['FOTO_KTPX']}`,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          }); 
        }

        var qryDelete = `DELETE FROM jmah_jamaahh WHERE NOXX_IDNT = '${req.body.NOXX_IDNT}'`;
        db.query(qryDelete, (err, result) => {
            if (err) {
                console.log('Error', err);
    
                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                var qryPass = `DELETE FROM jmah_jamaahp WHERE NOXX_IDNT = '${req.body.NOXX_IDNT}'`;
                db.query(qryPass, (err, result) => {
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
        });
      })
    });
  }

  pendaftaranJamaah = (req, res) => {
    // Menyimpan Foto KK
    var fotoKkDaftar = req.body.FOTO_KKXX;
    if (fotoKkDaftar != 'TIDAK') {        
      var fotoKkDaftarName = randomString(10) + Date.now() + '.png';
      fs.writeFile(`uploads/${fotoKkDaftarName}`, fotoKkDaftar, {encoding:'base64'}, function(err){
        if (err) {
          console.log(err);
        }else{
          console.log('berhasil');
        }
      });
      var namaKk = fotoKkDaftarName;
    }else{
      var namaKk = '';
    }

    // Menyimpan Foto Dokumen Lain
    var fotoKkDaftar = req.body.FOTO_DOCX;
    if (fotoKkDaftar != 'TIDAK') {        
      var fotoKkDaftarName = randomString(10) + Date.now() + '.png';
      fs.writeFile(`uploads/${fotoKkDaftarName}`, fotoKkDaftar, {encoding:'base64'}, function(err){
        if (err) {
          console.log(err);
        }else{
          console.log('berhasil');
        }
      });
      var namaDok = fotoKkDaftarName;
    }else{
      var namaDok = '';
    }

    // Menyimpan pendaftaran header
    var qry = `INSERT INTO mrkt_daftarh SET ?`;
    var data = {
      KDXX_DFTR : req.body.KDXX_DFTR,
      KDXX_JMAH : req.body.NOXX_IDNT,
      KDXX_PKET : req.body.KDXX_JDWL,
      KDXX_KNTR : req.body.KDXX_KNTR,
      DOKX_KTPX : req.body.DOKX_KTPX,
      DOKX_KKXX : req.body.DOKX_KKXX,
      DOKX_LAIN : req.body.DOKX_LAIN,
      PEMB_PSPR : req.body.PEMB_PSPR,
      PRSS_VKSN : req.body.PRSS_VKSN,
      HANDLING : req.body.HANDLING,
      REFRENSI : req.body.REFRENSI,
      KDXX_MRKT : req.body.KDXX_MRKT,
      ESTX_TOTL : req.body.ESTX_TOTL,
      JTUH_TEMP : req.body.JTUH_TEMP,
      FOTO_KKXX : namaKk,
      FOTO_DOCX : namaDok,
      STAS_BYAR : 0,
      UPDT_DATE : new Date(),
      UPDT_BYXX : 'sahrulramdani20'
    };

    db.query(qry, data, (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          status: false,
          message: err.sqlMessage,
        });
      } else {
        var tagihan = req.body.TAGIHAN;
        var jsonTagihan = JSON.parse(tagihan);
        var sts;

        for (let i = 0; i < jsonTagihan.length; i++) {
          var qry = `INSERT INTO mrkt_tagihanh SET ?`;
          var data = {
            // NOXX_TGIH : req.body.NOXX_TGIH,
            KDXX_DFTR : req.body.KDXX_DFTR,
            JENS_TGIH : jsonTagihan[i]['nama_tagihan'],
            TARIF_TGIH : jsonTagihan[i]['total_tagihan'],
            TOTL_TGIH : jsonTagihan[i]['total_tagihan'],
            SISA_TGIH : 0,
            UPDT_DATE : new Date(),
            UPDT_BYXX : 'sahrulramdani20'
          };      

          db.query(qry, data, (err, result) => {
              if (err) {
                  sts = false;
              } else {
                  sts = true;
              }
          });
        }

        res.send({
          status : true
        });
      }
    });

  }

  generateNumberPendaftaran = (req, res) => {
    const now = new Date();
    const tgl = date.format(now,"YYYY-MM-DD");
    const tahun = date.format(now,"YYYY");
    const tglReplace = tgl.replace(/-/g,"").toString();

    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '5' AND DOCX_CODE = 'PLG'";
    db.query(sql,function(err,rows,fields) {
      if (rows == '') {
        var sql = "INSERT INTO tb00_sequence SET ?";
        
        var data = {
          THNX_XXXX : tahun,
          IDXX_XXXX : '5',
          DOCX_CODE : 'PLG',
          DTLX_CODE : 'ID Pelanggan',
          NOXX_AKHR : 1,
        }
  
        db.query(sql,data,(err,result) => {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: err.sqlMessage,
            });
          } else {
            res.send({
              idPelanggan : `P${tglReplace}001`
            });
          }
        });
      }else{
        var no = '';
        rows.map((data) => {
           no = parseInt(data.NOXX_AKHR) + 1;
        })

        var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '5' AND DOCX_CODE = 'PLG' `;
        db.query(sqlUpdtSequence, (err,result) => {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: err.sqlMessage,
            });
          } else {
            res.send({
              idPelanggan : "P" + tglReplace + no.toString().padStart(3,"0"),
            });
          }
        });
      }
    });
  }

  generateNumberTagihan = (req, res) => {
    const now = new Date();
    const tgl = date.format(now,"YYYY-MM-DD");
    const tahun = date.format(now,"YYYY");
    const tglReplace = tgl.replace(/-/g,"").toString();

    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '6' AND DOCX_CODE = 'TGI'";
    db.query(sql,function(err,rows,fields) {
      if (rows == '') {
        var sql = "INSERT INTO tb00_sequence SET ?";
        
        var data = {
          THNX_XXXX : tahun,
          IDXX_XXXX : '6',
          DOCX_CODE : 'TGI',
          DTLX_CODE : 'No Tagihan',
          NOXX_AKHR : 1,
        }
  
        db.query(sql,data,(err,result) => {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: err.sqlMessage,
            });
          } else {
            res.send({
              idTagihan : `T${tglReplace}001`
            });
          }
        });
      }else{
        var no = '';
        rows.map((data) => {
           no = parseInt(data.NOXX_AKHR) + 1;
        })

        var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '6' AND DOCX_CODE = 'TGI' `;
        db.query(sqlUpdtSequence, (err,result) => {
          if (err) {
            console.log(err);
            res.send({
              status: false,
              message: err.sqlMessage,
            });
          } else {
            res.send({
              idTagihan : "T" + tglReplace + no.toString().padStart(3,"0"),
            });
          }
        });
      }
    });
  }
  
}
