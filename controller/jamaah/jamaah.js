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
        var sql = `SELECT a.*, TIMESTAMPDIFF(year,a.TGLX_LHIR,CURDATE()) AS UMUR, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT ORDER BY CRTX_DATE DESC`;
    
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

    getPelanggan = (req, res) => {
      var sql = `SELECT a.*,TIMESTAMPDIFF(year,a.TGLX_LHIR,CURDATE()) AS UMUR, b.KDXX_DFTR, b.HANDLING, IF(b.KDXX_MRKT = '' , b.REFRENSI, c.NAMA_LGKP) AS NAMA_MRKT, IFNULL(d.NOXX_PSPR,'BELUM') AS PASPORAN, (SELECT SUM(e.JMLX_BYAR) FROM mrkt_tagihanh e WHERE e.KDXX_DFTR = b.KDXX_DFTR) AS UANG_MASUK, ((b.ESTX_TOTL) - (SELECT SUM(e.JMLX_BYAR) FROM mrkt_tagihanh e WHERE e.KDXX_DFTR = b.KDXX_DFTR)) AS SISA, DATE_FORMAT(f.TGLX_BGKT, "%d-%m-%Y" )	AS BERANGKAT, IF(f.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS STS_BRGKT, g.NAMA_KNTR FROM jmah_jamaahh a LEFT JOIN mrkt_daftarh b ON a.NOXX_IDNT = b.KDXX_JMAH LEFT JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT LEFT JOIN jmah_jamaahp d ON a.NOXX_IDNT = d.NOXX_IDNT LEFT JOIN mrkt_jadwalh f ON b.KDXX_PKET = f.IDXX_JDWL LEFT JOIN hrsc_mkantorh g ON b.KDXX_KNTR = g.KDXX_KNTR WHERE b.KDXX_DFTR != '' ORDER BY b.KDXX_DFTR DESC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getDetailInfoPaket = (req,res) => {
      var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET,a.PSWT_BGKT, a.PSWT_PLNG ,a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA ,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, d.KDXX_JMAH FROM mrkt_jadwalh a LEFT JOIN mrkt_daftarh d ON a.IDXX_JDWL = d.KDXX_PKET WHERE d.KDXX_DFTR = '${req.params.id}'`;
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getDetailInfoPelanggan = (req,res) => {
      var sql = `SELECT a.*, DATE_FORMAT( a.TGLX_LHIR, "%d-%m-%Y" ) AS KELAHIRAN, IF(a.JENS_KLMN = 'P', 'Pria', 'Wanita') AS KELAMIN, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX,f.KDXX_DFTR FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT LEFT JOIN mrkt_daftarh f ON a.NOXX_IDNT = f.KDXX_JMAH WHERE f.KDXX_DFTR = '${req.params.id}'`;
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getDetailInfoEstimasi = (req,res) => {
      var sql = `SELECT a.KDXX_DFTR, a.HANDLING, a.ESTX_TOTL, IF(STAS_BYAR = 1,'LUNAS','BELUM') AS STS_LUNAS, DATE_FORMAT( a.JTUH_TEMP, "%d-%m-%Y" ) AS JATUH_TEMP, (IFNULL((SELECT b.TOTL_TGIH FROM mrkt_tagihanh b WHERE b.KDXX_DFTR = a.KDXX_DFTR AND b.JENS_TGIH = 'Vaksin'),0)) AS VAKSIN, (IFNULL((SELECT b.TOTL_TGIH FROM mrkt_tagihanh b WHERE b.KDXX_DFTR = a.KDXX_DFTR AND b.JENS_TGIH = 'Paspor'),0)) AS PASPOR, (IFNULL((SELECT b.TOTL_TGIH FROM mrkt_tagihanh b WHERE b.KDXX_DFTR = a.KDXX_DFTR AND b.JENS_TGIH = 'Biaya Admin'),0)) AS ADMIN, (SELECT SUM(b.JMLX_BYAR) FROM mrkt_tagihanh b WHERE b.KDXX_DFTR = a.KDXX_DFTR) AS UANG_MASUK, ((a.ESTX_TOTL) - (SELECT SUM(b.JMLX_BYAR) FROM mrkt_tagihanh b WHERE b.KDXX_DFTR = a.KDXX_DFTR)) AS SISA_TAGIHAN, c.TARIF_PKET AS BIAYA_PKET FROM mrkt_daftarh a LEFT JOIN mrkt_jadwalh c ON a.KDXX_PKET = c.IDXX_JDWL WHERE a.KDXX_DFTR = '${req.params.id}'`;
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getDetailRiwayatBayar = (req, res) => {
      var sql = `SELECT a.*, a.CRTX_DATE AS CRTXX, b.*, c.*, (IF(b.DIBAYARKAN = c.TOTL_TGIH,'Pelunasan','Pencicilan')) AS STS_PEMBAYARAN, ('Debit') AS JENIS FROM finc_bayarjamahh a LEFT JOIN finc_bayarjamahd b ON a.NOXX_FAKT = b.NOXX_FAKT LEFT JOIN mrkt_tagihanh c ON b.NOXX_TGIH = c.NOXX_TGIH WHERE c.KDXX_DFTR = '${req.params.id}' ORDER BY CRTXX DESC`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getLainnyaKwitansi = (req, res) => {
      var sql = `SELECT a.*, IFNULL( b.CODD_DESC, 'Tunai' ) AS NAME_BANK, IF ( a.NAMA_BANK, b.CODD_FLNM, 'TUNAI' ) AS CODD FROM finc_bayarjamahh a LEFT JOIN tb00_basx b ON a.NAMA_BANK = b.CODD_VALU HAVING KDXX_DFTR = '${req.params.id}' AND CODD = 'BANK' OR KDXX_DFTR = '${req.params.id}'AND CODD = 'TUNAI' ORDER BY CRTX_DATE DESC`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    saveFotoJamaah = (req, res) => {
      var fotoJamaah = req.body.FOTO_JMAH;
      if (fotoJamaah != 'TIDAK') {        
        var fotoJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/foto/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
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
        var fotoKtpJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/ktp/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
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

      res.send({
        status: true,
        foto: namaFoto,
        ktpx: namaKtp
      });
    }

    saveJamaah = (req, res) => {
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
        FOTO_JMAH : req.body.NAMA_FOTO,
        FOTO_KTPX : req.body.NAMA_KTPX,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'admin'
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
              CRTX_BYXX : 'admin'
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

  updateFotoJamaah = (req, res) => {
    // FOTO LAMA JAMAAH
    var fotoLama = req.body.FOTO_LAMA;
    if (fotoLama != '') {
      if (req.body.FOTO_JMAH == 'TIDAK') {
        var namaFoto = fotoLama;
      }else{
        fs.unlink(`uploads/foto/${fotoLama}`,function(err){
          if(err) return console.log(err);
          console.log('FOTO LAMA BERHASIL DIHAPUS');
        });  

        var fotoJamaah = req.body.FOTO_JMAH;
        var fotoJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/foto/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log('FOTO BARU GAGAL DIUPLOAD',err);
          }else{
            console.log('FOTO BARU BERHASIL DIUPLOAD');
          }
        });
        var namaFoto = fotoJamaahName;
      }
    }else{
      if(req.body.FOTO_JMAH == 'TIDAK'){
        var namaFoto = '';
      }else{
        var fotoJamaah = req.body.FOTO_JMAH;
        var fotoJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/foto/${fotoJamaahName}`, fotoJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log('FOTO LAMA GAGAL DIUPLOAD',err);
          }else{
            console.log('FOTO BARU BERHASIL DIUPLOAD');
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
        fs.unlink(`uploads/ktp/${ktpLama}`,function(err){
          if(err) return console.log(err);
          console.log('KTP BARU BERHASIL DIHAPUS');
        });  

        var fotoKtpJamaah = req.body.FOTO_KTPX;
        var fotoKtpJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/ktp/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log('KTP BARU GAGAL DIUPLOAD', err);
          }else{
            console.log('KTP BARU BERHASIL DIUPLOAD');
          }
        });
        var namaKtp = fotoKtpJamaahName;
      }
    }else{
      if (req.body.FOTO_KTPX == 'TIDAK') {
        var namaKtp = '';
      } else {
        var fotoKtpJamaah = req.body.FOTO_KTPX;
        var fotoKtpJamaahName = req.body.NOXX_IDNT + '.png';
        fs.writeFile(`uploads/ktp/${fotoKtpJamaahName}`, fotoKtpJamaah, {encoding:'base64'}, function(err){
          if (err) {
            console.log('KTP BARU GAGAL DIUPLOAD',err);
          }else{
            console.log('KTP BARU BERHASIL DIUPLOAD');
          }
        });
        var namaKtp = fotoKtpJamaahName;
      }
    }

    res.send({
      status: true,
      foto: namaFoto,
      ktpx: namaKtp
    });
  }

  updateJamaah = (req, res) => {
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
      FOTO_JMAH : req.body.NAMA_FOTO,
      FOTO_KTPX : req.body.NAMA_KTPX,
      UPDT_DATE : new Date(),
      UPDT_BYXX : 'admin'
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
                  UPDT_BYXX : 'admin'
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
                CRTX_BYXX : 'admin'
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

  generateNumberTagihan = () => {
    const now = new Date();
    const tgl = date.format(now,"YYYY-MM-DD");
    const tglReplace = tgl.replace(/-/g,"").toString();
  
    return new Promise((resolve, reject) => {
        const sql = `SELECT MAX(RIGHT(a.NOXX_TGIH, 3)) AS URUTX FROM mrkt_tagihanh a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;
        db.query(sql, function (err, rows, fields) {
          rows.map((data) => {
            if (data['URUTX'] == null) {
              var noTagihan = `T${tglReplace}001`;
  
              resolve(noTagihan);
            } else {
              var no = parseInt(data['URUTX']) + 1;
              var noTagihan = 'T' + tglReplace + no.toString().padStart(3,"0");
              
              resolve(noTagihan);
            }
          });
        });
    });
  };

  pendaftaranJamaahFoto = (req, res) => {
    // Menyimpan Foto KK
    var fotoKkDaftar = req.body.FOTO_KKXX;
    if (fotoKkDaftar != 'TIDAK') {        
      var fotoKkDaftarName = req.body.NOXX_IDNT + '.png';
      fs.writeFile(`uploads/kk/${fotoKkDaftarName}`, fotoKkDaftar, {encoding:'base64'}, function(err){
        if (err) {
          console.log('UPLOAD FOTO KK BERHASIL',err);
        }else{
          console.log('UPLOAD FOTO KK GAGAl');
        }
      });
      var namaKk = fotoKkDaftarName;
    }else{
      var namaKk = '';
    }

    // Menyimpan Foto Dokumen Lain
    var fotoDokDaftar = req.body.FOTO_DOCX;
    if (fotoDokDaftar != 'TIDAK') {        
      var fotoDokDaftarName = req.body.NOXX_IDNT + '.png';
      fs.writeFile(`uploads/lampiran/${fotoDokDaftarName}`, fotoDokDaftar, {encoding:'base64'}, function(err){
        if (err) {
          console.log('UPLOAD LAMPIRAN BERHASIL', err);
        }else{
          console.log('UPLOAD LAMPIRAN GAGAL');
        }
      });
      var namaDok = fotoDokDaftarName;
    }else{
      var namaDok = '';
    }

    res.send({
      status: true,
      kkxx: namaKk,
      dokx: namaDok
    });
  }


  pendaftaranJamaah = (req, res) => {
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
      FOTO_KKXX : req.body.NAMA_KKXX,
      FOTO_DOCX : req.body.NAMA_DOCX,
      STAS_BYAR : 0,
      STAS_BGKT : 0,
      CRTX_DATE : new Date(),
      CRTX_BYXX : 'admin'
    };

    db.query(qry, data, async (err, result) => {
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
          var idTagih = await this.generateNumberTagihan();

          var qry = `INSERT INTO mrkt_tagihanh SET ?`;
          var data = {
            NOXX_TGIH : idTagih,
            KDXX_DFTR : req.body.KDXX_DFTR,
            JENS_TGIH : jsonTagihan[i]['nama_tagihan'],
            TOTL_TGIH : jsonTagihan[i]['total_tagihan'],
            JMLX_BYAR : 0,
            SISA_TGIH : jsonTagihan[i]['total_tagihan'],
            CRTX_DATE : new Date(),
            CRTX_BYXX : 'admin'
          };      
          db.query(qry, data, (err, result) => {
              if (err) {
                  sts = false;
              } else {
                  sts = true;
              }
          });
        }

        // TAMBAH POIN
        var sqlUpdPerd = `UPDATE mrkt_agensih SET PERD_JMAH = (PERD_JMAH + 1), TOTL_JMAH = (TOTL_JMAH + 1) WHERE KDXX_MRKT = '${req.body.KDXX_MRKT}'`;
        db.query(sqlUpdPerd, (err,result) => {
          if (err) {
            sts = false;
          } else {
            sts = true;
          }
        });

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

    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '8' AND DOCX_CODE = 'PLG'";
    db.query(sql,function(err,rows,fields) {
      if (rows == '') {
        var sql = "INSERT INTO tb00_sequence SET ?";
        
        var data = {
          THNX_XXXX : tahun,
          IDXX_XXXX : '8',
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

        var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '8' AND DOCX_CODE = 'PLG' `;
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
  
}
