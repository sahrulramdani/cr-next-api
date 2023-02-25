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
import date from 'date-and-time';

export default class Marketing {

  getAllAgency = (req, res) => {
    // var sql = "SELECT a.* , IF( a.STAS_AGEN = '1', 'Aktif', 'Tidak Aktif' ) AS STATUS_AGEN, b.CODD_DESC AS FEE, c.CODD_DESC AS FIRST_LVL, d.NAMA_KNTR FROM mrkt_agensih a LEFT JOIN tb00_basx b ON a.FEEX_LVEL = b.CODD_VALU LEFT JOIN tb00_basx c ON a.FIRST_LVEL = c.CODD_VALU LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR ORDER BY CRTX_DATE DESC";

    var sql = "SELECT a.* , IF( a.STAS_AGEN = '1', 'Aktif', 'Tidak Aktif' ) AS STATUS_AGEN,IFNULL(b.CODD_DESC, '-') AS FEE, IFNULL((SELECT e.CODD_DESC FROM tb00_basx e WHERE e.CODD_VALU = a.FEEX_LVEL AND e.CODD_FLNM = 'FEELEVEL'),'-') AS FIRST_LVL, d.NAMA_KNTR FROM mrkt_agensih a LEFT JOIN tb00_basx b ON a.FEEX_LVEL = b.CODD_VALU  LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR ORDER BY CRTX_DATE DESC";

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

    db.query(getLast, function (err, rows, fields) {
      rows.map((data) => {
        if (data.LAST != null) {
          var lastCode = data.LAST.slice(-5);
          var getNumberCode = parseInt(lastCode) + 1;
          var numberCode = String(getNumberCode).padStart(5, '0');
          kode = 'AGMR' + numberCode;
        } else {
          kode = 'AGMR00001'
        }
      });

      res.send(kode);
    })

  }

  saveFotoAgency = (req, res) => {
    // --Menyimpan Gambar Agensi
    var fotoAgency = req.body.FOTO_AGEN;
    if (fotoAgency != 'TIDAK') {
      var fotoAgencyName = req.body.NOXX_IDNT + '.png';
      fs.writeFile(`uploads/foto/${fotoAgencyName}`, fotoAgency, { encoding: 'base64' }, function (err) {
        if (err) {
          console.log('FOTO GAGAL DIUPLOAD', err);
        } else {
          console.log('FOTO BERHASIL DIUPLOAD');
        }
      });

      var namaFoto = fotoAgencyName;
    } else {
      var namaFoto = req.body.FOTO_LMAX;
    }

    // --Menyimpan Gambar KTP
    var fotoKtpAgen = req.body.FOTO_KTPX;
    if (fotoKtpAgen != 'TIDAK') {
      var fotoKtpAgenName = req.body.NOXX_IDNT + '.png';
      fs.writeFile(`uploads/ktp/${fotoKtpAgenName}`, fotoKtpAgen, { encoding: 'base64' }, function (err) {
        if (err) {
          console.log('FOTO GAGAL DIUPLOAD', err);
        } else {
          console.log('FOTO BERHASIL DIUPLOAD');
        }
      });
      var namaKtp = fotoKtpAgenName
    } else {
      var namaKtp = req.body.KTPX_LMAX;
    }

    res.send({
      status: true,
      foto: namaFoto,
      ktpx: namaKtp
    });
  }

  saveAgency = (req, res) => {
    // Menyimpan Ke Database
    var qryIns = 'INSERT INTO mrkt_agensih SET ?';

    var data = {
      KDXX_MRKT: req.body.KDXX_AGEN,
      NOXX_IDNT: req.body.NOXX_IDNT,
      NAMA_LGKP: req.body.NAMA_LGKP,
      JENS_KLMN: req.body.JENS_KLMN,
      TMPT_LHIR: req.body.TMPT_LHIR,
      TGLX_LHIR: req.body.TGLX_LHIR,
      ALAMAT: req.body.ALAMAT,
      KDXX_KNTR: req.body.KDXX_KNTR,
      KDXX_PROV: req.body.KDXX_PROV,
      KDXX_KOTA: req.body.KDXX_KOTA,
      KDXX_KECX: req.body.KDXX_KECX,
      KDXX_KELX: req.body.KDXX_KELX,
      KDXX_POSX: req.body.KDXX_POSX,
      KDXX_LEAD: req.body.KDXX_LEAD,
      FEEX_LVEL: req.body.FEEX_LVEL,
      KATX_MRKT: req.body.KATX_MRKT,
      NAMA_PJWB: req.body.NAMA_PJWB,
      TELP_PJWB: req.body.TELP_PJWB,
      FIRST_LVEL: '4801',
      NAMA_AYAH: req.body.NAMA_AYAH,
      NOXX_TELP: req.body.NOXX_TELP,
      JENS_MNKH: req.body.JENS_MNKH,
      JENS_PEND: req.body.JENS_PEND,
      JENS_PKRJ: req.body.JENS_PKRJ,
      FEEX_LVEL: req.body.FEEX_LVEL,
      FOTO_AGEN: req.body.NAMA_FOTO,
      FOTO_KTPX: req.body.NAMA_KTPX,
      STAS_AGEN: 1,
      PERD_JMAH: 0,
      TOTL_JMAH: 0,
      TOTL_POIN: 0,
      TGLX_GBNG: moment(new Date()).format('YYYY-MM-DD'),
      CRTX_DATE: new Date(),
      CRTX_BYXX: 'admin'
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
            KDXX_MRKT: req.body.KDXX_AGEN,
            NOXX_PSPR: req.body.NOXX_PSPR,
            NAMA_PSPR: req.body.NAMA_LGKP,
            KLUR_DIXX: req.body.KLUR_DIXX,
            TGLX_KLUR: req.body.TGLX_KLUR,
            TGLX_EXPX: req.body.TGLX_EXPX,
            CRTX_DATE: new Date(),
            CRTX_BYXX: 'admin'
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
        } else {
          res.send({
            status: true
          });
        }
      }
    });
  }


  saveAgencyBank = (req, res) => {
    var id = req.body.KDXX_MRKT;
    var sql = `SELECT a.* FROM mrkt_agensir a WHERE a.KDXX_MRKT = '${id}'`;

    db.query(sql, function (err, rows, fields) {
      if (rows != '') {
        var qryUpd = `update mrkt_agensir set ? where KDXX_MRKT = '${req.body.KDXX_MRKT}'`;
        var dataUpd = {
          KDXX_MRKT: req.body.KDXX_MRKT,
          NOXX_REKX: req.body.NOXX_REKX,
          NAMA_REKX: req.body.NAMA_REKX,
          KDXX_BANK: req.body.KDXX_BANK,
          STAS_REKX: req.body.STAS_REKX,
          UPDT_DATE: new Date(),
          UPDT_BYXX: 'admin'
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
      } else {
        var qryIns = 'INSERT INTO mrkt_agensir SET ?';

        var dataIns = {
          KDXX_MRKT: req.body.KDXX_MRKT,
          NOXX_REKX: req.body.NOXX_REKX,
          NAMA_REKX: req.body.NAMA_REKX,
          KDXX_BANK: req.body.KDXX_BANK,
          STAS_REKX: req.body.STAS_REKX,
          CRTX_DATE: new Date(),
          CRTX_BYXX: 'admin'
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


  updateFotoAgency = (req, res) => {
      // --Menyimpan Gambar
      var fotoLama = req.body.FOTO_LAMA;
      if (fotoLama != '') {
        if (req.body.FOTO_AGEN == 'TIDAK') {
          var namaFoto = fotoLama;
        } else {
          fs.unlink(`uploads/foto/${fotoLama}`, function (err) {
            if (err) return console.log(err);
            console.log('FOTO LAMA BERHASIL DIHAPUS');
          });

          var fotoAgen = req.body.FOTO_AGEN;
          var fotoAgenName = req.body.NOXX_IDNT + '.png';
          fs.writeFile(`uploads/foto/${fotoAgenName}`, fotoAgen, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('FOTO BARU GAGAL DIUPLOAD' ,err);
            } else {
              console.log('FOTO BARU BERHASIL DIUPLOAD');
            }
          });
          var namaFoto = fotoAgenName;
        }
      } else {
        if (req.body.FOTO_AGEN == 'TIDAK') {
          var namaFoto = '';
        } else {
          var fotoAgen = req.body.FOTO_AGEN;
          var fotoAgenName = req.body.NOXX_IDNT + '.png';
          fs.writeFile(`uploads/foto/${fotoAgenName}`, fotoAgen, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('FOTO BARU GAGAL DIUPLOAD', err);
            } else {
              console.log('FOTO BARU BERHASIL DIUPLOAD');
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
        } else {
          fs.unlink(`uploads/ktp/${ktpLama}`, function (err) {
            if (err) return console.log(err);
            console.log('FOTO KTP BERHASIL DIHAPUS');
          });

          var fotoKtpAgen = req.body.FOTO_KTPX;
          var fotoKtpAgenName = req.body.NOXX_IDNT + '.png';
          fs.writeFile(`uploads/ktp/${fotoKtpAgenName}`, fotoKtpAgen, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('KTP BARU GAGAL DIUPLOAD', err);
            } else {
              console.log('KTP BARU BERHASIL DIUPLOAD');
            }
          });
          var namaKtp = fotoKtpAgenName;
        }
      } else {
        if (req.body.FOTO_KTPX == 'TIDAK') {
          var namaKtp = '';
        } else {
          var fotoKtpAgen = req.body.FOTO_KTPX;
          var fotoKtpAgenName = req.body.NOXX_IDNT + '.png';
          fs.writeFile(`uploads/ktp/${fotoKtpAgenName}`, fotoKtpAgen, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('KTP BARU GAGAL DIUPLOAD', err);
            } else {
              console.log('KTP BARU BERHASIL DIUPLOAD');
            }
          });
          var namaKtp = fotoKtpAgenName;
        }
      }
      
    res.send({
      status: true,
      foto: namaFoto,
      ktpx: namaKtp
    });
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
          } else {
            firstLvl = '4804'
          }
        })
      } else {
        var firstLvl = '4801';
      }
      
      // --Menyimpan ke database
      var qryUpdate = `UPDATE mrkt_agensih SET ? WHERE KDXX_MRKT = '${req.body.KDXX_AGEN}'`;
      var data = {
        KDXX_MRKT: req.body.KDXX_AGEN,
        NOXX_IDNT: req.body.NOXX_IDNT,
        NAMA_LGKP: req.body.NAMA_LGKP,
        JENS_KLMN: req.body.JENS_KLMN,
        TMPT_LHIR: req.body.TMPT_LHIR,
        TGLX_LHIR: req.body.TGLX_LHIR,
        ALAMAT: req.body.ALAMAT,
        KDXX_KNTR: req.body.KDXX_KNTR,
        KDXX_PROV: req.body.KDXX_PROV,
        KDXX_KOTA: req.body.KDXX_KOTA,
        KDXX_KECX: req.body.KDXX_KECX,
        KDXX_KELX: req.body.KDXX_KELX,
        KDXX_POSX: req.body.KDXX_POSX,
        KDXX_LEAD: req.body.KDXX_LEAD,
        FEEX_LVEL: req.body.FEEX_LVEL,
        KATX_MRKT: req.body.KATX_MRKT,
        NAMA_PJWB: req.body.NAMA_PJWB,
        TELP_PJWB: req.body.TELP_PJWB,
        FIRST_LVEL: firstLvl,
        NAMA_AYAH: req.body.NAMA_AYAH,
        NOXX_TELP: req.body.NOXX_TELP,
        JENS_MNKH: req.body.JENS_MNKH,
        JENS_PEND: req.body.JENS_PEND,
        JENS_PKRJ: req.body.JENS_PKRJ,
        FEEX_LVEL: req.body.FEEX_LVEL,
        FOTO_AGEN: req.body.NAMA_FOTO,
        FOTO_KTPX: req.body.NAMA_KTPX,
        STAS_AGEN: req.body.STAS_AGEN,
        TGLX_GBNG: moment(new Date()).format('YYYY-MM-DD'),
        UPDT_DATE: new Date(),
        UPDT_BYXX: 'admin'
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
                  KDXX_MRKT: req.body.KDXX_MRKT,
                  NOXX_PSPR: req.body.NOXX_PSPR,
                  NAMA_PSPR: req.body.NAMA_LGKP,
                  KLUR_DIXX: req.body.KLUR_DIXX,
                  TGLX_KLUR: req.body.TGLX_KLUR,
                  TGLX_EXPX: req.body.TGLX_EXPX,
                  UPDT_DATE: new Date(),
                  UPDT_BYXX: 'admin'
                }

                db.query(updPass, dataPass, (err, result) => {
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
              } else {
                var qryPspr = 'INSERT INTO mrkt_agensip SET ?';
                var dataPspr = {
                  KDXX_MRKT: req.body.KDXX_AGEN,
                  NOXX_PSPR: req.body.NOXX_PSPR,
                  NAMA_PSPR: req.body.NAMA_LGKP,
                  KLUR_DIXX: req.body.KLUR_DIXX,
                  TGLX_KLUR: req.body.TGLX_KLUR,
                  TGLX_EXPX: req.body.TGLX_EXPX,
                  CRTX_DATE: new Date(),
                  CRTX_BYXX: 'admin'
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
              }
            }
            );
          } else {
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
    var sql = `SELECT a.KDXX_JMAH, a.STAS_BYAR, b.NAMA_LGKP, c.TGLX_BGKT, IF ( c.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS CEK, d.NAMA_KNTR,	( SELECT e.CODD_DESC FROM tb00_basx e WHERE e.CODD_VALU = c.NAMA_PKET AND e.CODD_FLNM = "PAKET_XXXX" ) AS PAKETNA, ( SELECT e.CODD_DESC FROM tb00_basx e WHERE e.CODD_VALU = c.JENS_PKET AND e.CODD_FLNM = "JNS_PAKET" ) AS JENISNA FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.NOXX_IDNT LEFT JOIN mrkt_jadwalh c ON a.KDXX_PKET = c.IDXX_JDWL LEFT JOIN hrsc_mkantorh d ON a.KDXX_KNTR = d.KDXX_KNTR WHERE a.KDXX_MRKT = '${req.params.id}'`

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

  getDetailUpline = (req, res) => {
    var sql = `SELECT a.KDXX_LEAD, b.*, c.CODD_DESC AS FEE, d.NAMA_KNTR FROM mrkt_agensih a LEFT JOIN mrkt_agensih b ON a.KDXX_LEAD = b.KDXX_MRKT  LEFT JOIN tb00_basx c ON b.FEEX_LVEL = c.CODD_VALU LEFT JOIN hrsc_mkantorh d ON b.KDXX_KNTR = d.KDXX_KNTR WHERE a.KDXX_MRKT = '${req.params.id}'`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }


  saveJadwal = (req, res) => {
    console.log('PROT');
    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '1' AND DOCX_CODE = 'JWL'";
    db.query(sql, function (err, rows, fields) {

      const now = new Date();
      const tgl = date.format(now, "YYYY-MM-DD");
      const tglReplace = tgl.replace(/-/g, "").toString();

      if (rows != '') {
        var no = '';
        rows.map((data) => {
          no = parseInt(data.NOXX_AKHR) + 1;
        })
      }

      var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '1' AND DOCX_CODE = 'JWL' `;

      db.query(sqlUpdtSequence, function (err, rows, fields) {
        var id = "J" + tglReplace + no.toString().padStart(4, "0");

        var sqlInsert = "INSERT INTO mrkt_jadwalh SET ?";
        var data = {
          KDXX_JDWL: req.body.KDXX_JDWL,
          IDXX_JDWL: id,
          NAMA_PKET: req.body.NAMA_PKET,
          JENS_PKET: req.body.JENS_PKET,
          HOTL_MEKX: req.body.HOTL_MEKX,
          HOTL_MADX: req.body.HOTL_MADX,
          HOTL_JEDX: req.body.HOTL_JEDX,
          HOTL_TRAX: req.body.HOTL_TRAX,
          TJAN_PKET: req.body.TJAN_PKET,
          TGLX_BGKT: req.body.TGLX_BGKT,
          TGLX_PLNG: req.body.TGLX_PLNG,
          JMLX_HARI: req.body.JMLX_HARI,
          PSWT_BGKT: req.body.PSWT_BGKT,
          PSWT_PLNG: req.body.PSWT_PLNG,
          RUTE_AWAL_BRKT: req.body.RUTE_AWAL_BRKT,
          RUTE_TRNS_BRKT: req.body.RUTE_TRNS_BRKT,
          RUTE_AKHR_BRKT: req.body.RUTE_AKHR_BRKT,
          RUTE_AWAL_PLNG: req.body.RUTE_AWAL_PLNG,
          RUTE_TRNS_PLNG: req.body.RUTE_TRNS_PLNG,
          RUTE_AKHR_PLNG: req.body.RUTE_AKHR_PLNG,
          TARIF_PKET: req.body.TARIF_PKET,
          JMLX_SEAT: req.body.JMLX_SEAT,
          MATA_UANG: req.body.MATA_UANG,
          STAS_AKTF: '1',
          STAS_BGKT: '0',
          KETERANGAN: req.body.KETERANGAN,
          CRTX_DATE: new Date(),
          CRTX_BYXX: "alfi",
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

      });
    });
  }

  updateJadwal = (req, res) => {
    var sql = `UPDATE mrkt_jadwalh SET ? WHERE IDXX_JDWL = "${req.body.IDXX_JDWL}" `;

    var data = {
      IDXX_JDWL: req.body.IDXX_JDWL,
      NAMA_PKET: req.body.NAMA_PKET,
      JENS_PKET: req.body.JENS_PKET,
      HOTL_MEKX: req.body.HOTL_MEKX,
      HOTL_MADX: req.body.HOTL_MADX,
      HOTL_JEDX: req.body.HOTL_JEDX,
      HOTL_TRAX: req.body.HOTL_TRAX,
      TJAN_PKET: req.body.TJAN_PKET,
      TGLX_BGKT: moment(req.body.TGLX_BGKT).format("YYYY-MM-DD"),
      TGLX_PLNG: moment(req.body.TGLX_PLNG).format("YYYY-MM-DD"),
      JMLX_HARI: req.body.JMLX_HARI,
      PSWT_BGKT: req.body.PSWT_BGKT,
      PSWT_PLNG: req.body.PSWT_PLNG,
      RUTE_AWAL_BRKT: req.body.RUTE_AWAL_BRKT,
      RUTE_TRNS_BRKT: req.body.RUTE_TRNS_BRKT,
      RUTE_AKHR_BRKT: req.body.RUTE_AKHR_BRKT,
      RUTE_AWAL_PLNG: req.body.RUTE_AWAL_PLNG,
      RUTE_TRNS_PLNG: req.body.RUTE_TRNS_PLNG,
      RUTE_AKHR_PLNG: req.body.RUTE_AKHR_PLNG,
      TARIF_PKET: req.body.TARIF_PKET,
      JMLX_SEAT: req.body.JMLX_SEAT,
      MATA_UANG: req.body.MATA_UANG,
      KETERANGAN: req.body.KETERANGAN,
      UPDT_DATE: new Date(),
      UPDT_BYXX: "alfi",
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

  deleteJadwal = (req, res) => {
    var sql = `UPDATE mrkt_jadwalh SET ? WHERE IDXX_JDWL = "${req.body.IDXX_JDWL}" `;

    var data = {
      STAS_AKTF: '0',
      UPDT_DATE: new Date(),
      UPDT_BYXX: "alfi",
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

  getJenisPaket = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'JNS_PAKET'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getPaket = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'PAKET_XXXX'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getMataUang = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'CURR_MNYX'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getTransit = (req, res) => {
    var sql = "SELECT IDXX_RTS, NAMA_NEGR FROM m_rutetransit order by CRTX_DATE DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getMaskapai = (req, res) => {
    var sql = "SELECT IDXX_PSWT, NAMA_PSWT FROM m_pesawat order by CRTX_DATE DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getHotel = (req, res) => {
    var sql = "SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,a.KTGR_HTLX,c.CODD_DESC AS namaKota,b.CODD_DESC FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX' ORDER BY a.CRTX_DATE DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }


  getHotelMekkah = (req, res) => {
    var sql = "SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,b.CODD_DESC,c.CODD_DESC as KOTA FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX' AND a.KTGR_HTLX = '01' ORDER BY a.BINTG_HTLX DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }
  getHotelMadinah = (req, res) => {
    var sql = "SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,b.CODD_DESC,c.CODD_DESC as KOTA FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX' AND a.KTGR_HTLX = '02' ORDER BY a.BINTG_HTLX DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getHotelPlus = (req, res) => {
    var sql = "SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,b.CODD_DESC,c.CODD_DESC as KOTA FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX' AND a.KTGR_HTLX = '03' ORDER BY a.BINTG_HTLX DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getHotelTransit = (req, res) => {
    var sql = "SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,b.CODD_DESC,c.CODD_DESC as KOTA FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX' AND a.KTGR_HTLX = '04' ORDER BY a.BINTG_HTLX DESC";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getAllJadwal = (req, res) => {
    // DATE_FORMAT(a.TGL_PRMN, "%Y-%m-%d") AS TGL_TRAN
    var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET, a.PSWT_BGKT, a.PSWT_PLNG,(SELECT b.NAMA_PSWT FROM m_pesawat b WHERE b.IDXX_PSWT = a.PSWT_BGKT) AS NAME_PESWT_BGKT,(SELECT b.NAMA_PSWT FROM m_pesawat b WHERE b.IDXX_PSWT = a.PSWT_PLNG) AS NAME_PESWT_PLNG, a.RUTE_AWAL_BRKT,a.RUTE_TRNS_BRKT,a.RUTE_AKHR_BRKT,a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA FROM mrkt_jadwalh a WHERE a.STAS_AKTF = '1' ORDER BY a.TGLX_BGKT DESC`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getAllJadwalDash = (req, res) => {
    var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET, a.PSWT_BGKT, a.KETX_RUTE, a.KETX_HTLX, a.PSWT_PLNG,(SELECT b.NAMA_PSWT FROM m_pesawat b WHERE b.IDXX_PSWT = a.PSWT_BGKT) AS NAME_PESWT_BGKT,(SELECT b.NAMA_PSWT FROM m_pesawat b WHERE b.IDXX_PSWT = a.PSWT_PLNG) AS NAME_PESWT_PLNG, a.RUTE_AWAL_BRKT,a.RUTE_TRNS_BRKT,a.RUTE_AKHR_BRKT,a.RUTE_AWAL_PLNG,a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA,e.CODD_DESC,(SELECT COUNT(b.KDXX_PKET) FROM mrkt_daftarh b WHERE b.KDXX_PKET = a.IDXX_JDWL) AS TERISI FROM mrkt_jadwalh a LEFT JOIN m_hotel d ON d.IDXX_HTLX = a.HOTL_MEKX LEFT JOIN tb00_basx e ON e.CODD_VALU = d.BINTG_HTLX AND e.CODD_FLNM = 'BINTG_HTLX' WHERE a.STAS_AKTF = '1' ORDER BY a.TGLX_BGKT ASC`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  
  getJadwalAvailable = (req, res) => {
    var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET,a.PSWT_BGKT, a.PSWT_PLNG,a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET, a.STAS_AKTF AS STS ,a.MATA_UANG,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA FROM mrkt_jadwalh a HAVING status = '0' AND STS = '1' AND SISA > 0 ORDER BY a.TGLX_BGKT DESC`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDetailJadwal = (req, res) => {
    var id = req.params.id;

    var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET,a.PSWT_BGKT,a.PSWT_PLNG,a.RUTE_AWAL_BRKT,a.RUTE_TRNS_BRKT,b.NAMA_NEGR,a.RUTE_AKHR_BRKT,a.RUTE_AWAL_PLNG,a.RUTE_TRNS_PLNG,(SELECT e.NAMA_NEGR FROM m_rutetransit e WHERE e.IDXX_RTS = a.RUTE_TRNS_PLNG ) AS NAMA_NEGRATRPLNG,a.RUTE_AKHR_PLNG,a.JMLX_SEAT,a.HOTL_MEKX,a.HOTL_MADX,a.HOTL_JEDX,a.HOTL_TRAX,c.NAMA_PSWT AS PESAWAT_BERANGKAT,d.NAMA_HTLX AS HOTEL_MEKKAH,(SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,a.NAMA_PKET,(SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,a.JENS_PKET,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" )AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG,(SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.MATA_UANG AND b.CODD_FLNM = "CURR_MNYX" ) AS MataUang,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS STATUS,f.NAMA_PSWT AS PESAWAT_PULANG,g.NAMA_HTLX AS HOTEL_MADINAH,h.NAMA_HTLX AS HOTEL_JEDDAH,i.NAMA_HTLX AS HOTEL_TRANSIT,j.KDXX_DESC AS NAMA_TUJUAN FROM mrkt_jadwalh a LEFT JOIN m_rutetransit b ON a.RUTE_TRNS_BRKT = b.IDXX_RTS LEFT JOIN m_pesawat c ON a.PSWT_BGKT = c.IDXX_PSWT LEFT JOIN m_hotel d ON a.HOTL_MEKX = d.IDXX_HTLX LEFT JOIN m_pesawat f ON a.PSWT_PLNG = f.IDXX_PSWT LEFT JOIN m_hotel g ON a.HOTL_MADX = g.IDXX_HTLX LEFT JOIN m_hotel h ON a.HOTL_JEDX = h.IDXX_HTLX LEFT JOIN m_hotel i ON a.HOTL_TRAX = i.IDXX_HTLX LEFT JOIN xxxx_masterdata j ON a.TJAN_PKET = j.KDXX_VALU WHERE a.IDXX_JDWL = "${id}"`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }


  getDetailJadwalJamaah = (req, res) => {
    var id = req.params.id;

    var sql = `SELECT a.KDXX_DFTR, a.PEMB_PSPR, a.PRSS_VKSN, a.HANDLING, b.*, TIMESTAMPDIFF(year,b.TGLX_LHIR,CURDATE()) AS UMUR, IFNULL((SELECT SUM(c.TOTL_TGIH) FROM mrkt_tagihanh c WHERE c.KDXX_DFTR = a.KDXX_DFTR),0) AS EST_TOTAL, IFNULL((SELECT SUM(c.JMLX_BYAR) FROM mrkt_tagihanh c WHERE c.KDXX_DFTR = a.KDXX_DFTR),0) AS MASUK, IFNULL((SELECT SUM(c.SISA_TGIH) FROM mrkt_tagihanh c WHERE c.KDXX_DFTR = a.KDXX_DFTR),0) AS SISA, IF(a.STAS_BYAR = 1, 'Lunas', 'Belum') AS STATUS_BAYAR, d.*, e.CODD_DESC AS MENIKAH, f.CODD_DESC AS PENDIDIKAN, g.CODD_DESC AS PEKERJAAN FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.NOXX_IDNT LEFT JOIN jmah_jamaahp d ON d.NOXX_IDNT = a.KDXX_JMAH LEFT JOIN tb00_basx e ON b.JENS_MNKH = e.CODD_VALU LEFT JOIN tb00_basx f ON b.JENS_PEND = f.CODD_VALU LEFT JOIN tb00_basx g ON b.JENS_PKRJ = g.CODD_VALU WHERE a.KDXX_PKET = '${id}'`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getAllPemberangkatan = (req, res) => {
    var sql = `SELECT a.IDXX_JDWL, a.JMLX_HARI, a.KETERANGAN, a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET") AS jenisPaket, DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT, DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG, IF ( a.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS STATUS, (( a.JMLX_SEAT ) - ( IFNULL(( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL ), 0 ))) AS SISA, IFNULL((SELECT COUNT(d.KDXX_DFTR) FROM mrkt_daftarh d WHERE d.KDXX_MRKT != '' AND d.KDXX_PKET = a.IDXX_JDWL),0) AS JAMAAH_AGEN, IFNULL((SELECT COUNT(d.KDXX_DFTR) FROM mrkt_daftarh d WHERE d.KDXX_MRKT = '' AND d.KDXX_PKET = a.IDXX_JDWL),0) AS JAMAAH_KNTR, IFNULL(( SELECT COUNT( d.KDXX_DFTR ) FROM mrkt_daftarh d WHERE d.KDXX_PKET = a.IDXX_JDWL ), 0 ) AS TOTL_KONFIRMASI FROM mrkt_jadwalh a WHERE a.STAS_AKTF = '1' ORDER BY a.TGLX_BGKT DESC`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getListJamaahPemberangkatan = (req, res) => {
    var sql = `SELECT a.KDXX_DFTR, a.KDXX_MRKT, b.NAMA_LGKP AS NAMA_JMAH, c.NAMA_LGKP AS NAMA_MRKT, IF(a.KDXX_MRKT = '','Langsung','Marketing') AS JENIS_DAFTAR, e.CODD_DESC AS FIRST_LEVEL, f.NAMA_KNTR AS DAFTAR_VIA, IF((SELECT SUM(g.SISA_TGIH) FROM mrkt_tagihanh g WHERE g.KDXX_DFTR = a.KDXX_DFTR) = 0,'Lunas','Belum') AS BIAYA, IF((SELECT h.NOXX_REKX FROM mrkt_agensir h WHERE h.KDXX_MRKT = a.KDXX_MRKT), '1', '0') AS VB FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.NOXX_IDNT LEFT JOIN mrkt_agensih c ON a.KDXX_MRKT = c.KDXX_MRKT LEFT JOIN tb00_basx e ON c.FIRST_LVEL = e.CODD_VALU LEFT JOIN hrsc_mkantorh f ON a.KDXX_KNTR = f.KDXX_KNTR WHERE a.KDXX_PKET = '${req.params.id}' ORDER BY a.CRTX_DATE`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDetailJamaahPemberangkatan = (req, res) => {
    var sql = `SELECT a.KDXX_DFTR, a.KDXX_MRKT, b.NAMA_LGKP AS NAMA_JMAH, b.NOXX_TELP AS TELP_JMAH, c.NAMA_LGKP AS NAMA_MRKT, (SELECT m.CODD_DESC FROM tb00_basx m WHERE m.CODD_VALU = g.JENS_PKET AND m.CODD_FLNM = 'JNS_PAKET') AS JENIS_PAKET, c.NOXX_TELP AS TELP_MRKT, IF(a.KDXX_MRKT = '','Langsung','Marketing') AS JENIS_DAFTAR, e.CODD_DESC AS FIRST_LEVEL, f.NAMA_KNTR AS DAFTAR_VIA, IF((SELECT SUM(g.SISA_TGIH) FROM mrkt_tagihanh g WHERE g.KDXX_DFTR = a.KDXX_DFTR) = 0,'Lunas','Belum') AS BIAYA, DATE_FORMAT( g.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT, (SELECT h.NAMA_LGKP FROM mrkt_agensih h WHERE h.KDXX_MRKT = c.KDXX_LEAD) AS LEAD_FIRST, (SELECT j.NAMA_LGKP FROM mrkt_agensih i LEFT JOIN mrkt_agensih j ON i.KDXX_LEAD = j.KDXX_MRKT WHERE i.KDXX_MRKT = c.KDXX_LEAD) AS LEAD_SECOND, (SELECT l.NOXX_REKX FROM mrkt_agensih h LEFT JOIN mrkt_agensir l ON l.KDXX_MRKT = h.KDXX_MRKT WHERE h.KDXX_MRKT = c.KDXX_LEAD ) AS SVB_FIRST, (SELECT k.NOXX_REKX FROM mrkt_agensih i LEFT JOIN mrkt_agensih j ON i.KDXX_LEAD = j.KDXX_MRKT LEFT JOIN mrkt_agensir k ON j.KDXX_MRKT = k.KDXX_MRKT WHERE i.KDXX_MRKT = c.KDXX_LEAD ) AS SVB_SECOND FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.NOXX_IDNT LEFT JOIN mrkt_agensih c ON a.KDXX_MRKT = c.KDXX_MRKT LEFT JOIN tb00_basx e ON c.FIRST_LVEL = e.CODD_VALU LEFT JOIN hrsc_mkantorh f ON a.KDXX_KNTR = f.KDXX_KNTR LEFT JOIN mrkt_jadwalh g ON a.KDXX_PKET = g.IDXX_JDWL WHERE a.KDXX_DFTR = '${req.params.id}'`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  // Rute Transit

  getDetailTransit = (req, res) => {
    var id = req.params.id;
    var sql = `SELECT IDXX_RTS, NAMA_NEGR FROM m_rutetransit WHERE IDXX_RTS = '${id}'`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  saveRuteTransit = (req, res) => {
    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '5' AND DOCX_CODE = 'TRS'";

    db.query(sql, function (err, rows, fields) {
      if (rows != '') {
        var no = '';
        rows.map((data) => {
          no = parseInt(data.NOXX_AKHR) + 1;
        })
      }

      var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '5' AND DOCX_CODE = 'TRS' `;

      db.query(sqlUpdtSequence, function (err, rows, fields) {
        var id = "TS" + no.toString().padStart(4, "0");

        var sqlInsert = "INSERT INTO m_rutetransit SET ?";
        var data = {
          IDXX_RTS: id,
          NAMA_NEGR: req.body.NAMA_NEGR,
          CRTX_BYXX: "alfi",
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

      })
    });

  }

  updateRuteTransit = (req, res) => {
    var sql = `UPDATE m_rutetransit SET ? WHERE IDXX_RTS = '${req.body.IDXX_RTS}'`;

    var data = {
      IDXX_RTS: req.body.IDXX_RTS,
      NAMA_NEGR: req.body.NAMA_NEGR,
      UPDT_BYXX: "alfi",
      UPDT_DATE: new Date(),
    }

    db.query(sql, data, (err, result) => {
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

  deleteRuteTransit = (req, res) => {
    var sql = `DELETE FROM m_rutetransit WHERE IDXX_RTS = '${req.body.IDXX_RTS}'`;

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

  
  // Maskapai
  saveMaskapai = (req, res) => {
    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '6' AND DOCX_CODE = 'PWT'";

    db.query(sql, function (err, rows, fields) {
      if (rows != '') {
        var no = '';
        rows.map((data) => {
          no = parseInt(data.NOXX_AKHR) + 1;
        })
      }

      var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '6' AND DOCX_CODE = 'PWT' `;

      db.query(sqlUpdtSequence, function (err, rows, fields) {
        var id = "MKP" + no.toString().padStart(4, "0");

        var sqlInsert = "INSERT INTO m_pesawat SET ?";
        var data = {
          IDXX_PSWT: id,
          NAMA_PSWT: req.body.NAMA_PSWT,
          CRTX_BYXX: "alfi",
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

      })
    });

  }

  updateMaskapai = (req, res) => {
    var sql = `UPDATE m_pesawat SET ? WHERE IDXX_PSWT = '${req.body.IDXX_PSWT}'`;

    var data = {
      IDXX_PSWT: req.body.IDXX_PSWT,
      NAMA_PSWT: req.body.NAMA_PSWT,
      UPDT_BYXX: "alfi",
      UPDT_DATE: new Date(),
    }

    db.query(sql, data, (err, result) => {
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

  deleteMaskapai = (req, res) => {
    var sql = `DELETE FROM m_pesawat WHERE IDXX_PSWT = '${req.body.IDXX_PSWT}'`;

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

  getDetailMaskapai = (req, res) => {
    var id = req.params.id;
    var sql = `SELECT IDXX_PSWT, NAMA_PSWT FROM m_pesawat WHERE IDXX_PSWT = '${id}'`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  // Marketing Hotel
  saveHotel = (req, res) => {
    var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '7' AND DOCX_CODE = 'HTL'";

    db.query(sql, function (err, rows, fields) {
      if (rows != '') {
        var no = '';
        rows.map((data) => {
          no = parseInt(data.NOXX_AKHR) + 1;
        })
      }

      var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '7' AND DOCX_CODE = 'HTL' `;

      db.query(sqlUpdtSequence, function (err, rows, fields) {
        var id = "HTL" + no.toString().padStart(4, "0");

        var sqlInsert = "INSERT INTO m_hotel SET ?";
        var data = {
          IDXX_HTLX: id,
          NAMA_HTLX: req.body.NAMA_HTLX,
          BINTG_HTLX: req.body.BINTG_HTLX,
          KTGR_HTLX: req.body.KTGR_HTLX,
          CRTX_BYXX: "alfi",
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

      })
    });

  }

  updateHotel = (req, res) => {
    var sql = `UPDATE m_hotel SET ? WHERE IDXX_HTLX = '${req.body.IDXX_HTLX}'`;

    var data = {
      IDXX_HTLX: req.body.IDXX_HTLX,
      NAMA_HTLX: req.body.NAMA_HTLX,
      BINTG_HTLX: req.body.BINTG_HTLX,
      KTGR_HTLX: req.body.KTGR_HTLX,
      UPDT_BYXX: "alfi",
      UPDT_DATE: new Date(),
    }

    console.log(sql, data)

    db.query(sql, data, (err, result) => {
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

  deleteHotel = (req, res) => {
    var sql = `DELETE FROM m_hotel WHERE IDXX_HTLX = '${req.body.IDXX_PSWT}'`;

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

  getDetailHotel = (req, res) => {
    var id = req.params.id;
    var sql = `SELECT a.IDXX_HTLX, a.NAMA_HTLX, a.BINTG_HTLX,a.KTGR_HTLX,c.CODD_DESC as namaKota,b.CODD_DESC FROM m_hotel a INNER JOIN tb00_basx b ON a.BINTG_HTLX = b.CODD_VALU INNER JOIN tb00_basx c ON a.KTGR_HTLX = c.CODD_VALU WHERE b.CODD_FLNM = 'BINTG_HTLX' AND c.CODD_FLNM = 'KOTA_XXX'AND IDXX_HTLX = '${id}'`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getBintangHotel = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'BINTG_HTLX'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getKategori = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'KOTA_XXX'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getKota = (req, res) => {
    var sql = "SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'KOTA_XXX'";
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getChart = (req, res) => {
    var sql = `SELECT NAMA_LGKP, KDXX_POSX FROM mrkt_agensih`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

}
