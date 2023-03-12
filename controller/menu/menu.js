import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';
import moment from 'moment';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';
import date from 'date-and-time';
import fs from 'fs';

export default class Menu {
    getGrupUser = (req, res) => {
        var sql = `SELECT * FROM user_grupuser`
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    }

    getMenuAll = (req, res) => {
      var sql = `SELECT a.*, b.* FROM tb00_menus a LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE ORDER BY a.PROC_CODE DESC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getTypeAll = (req, res) => {
      var sql = `SELECT CODD_VALU, CODD_DESC FROM tb00_basx WHERE CODD_FLNM = 'MDUL_TYPE' ORDER BY id ASC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getMenuModulAll = (req, res) => {
      var sql = `SELECT a.* FROM tb00_menus a WHERE a.PARENT = '0' ORDER BY a.NOXX_URUT ASC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPenggunaAll = (req, res) => {
      var sql = `SELECT a.*, IFNULL(DATE_FORMAT( (SELECT MAX(b.START_DATE) FROM history_login b WHERE b.USER_IDXX = a.USER_IDXX), "%d-%m-%Y" ), DATE_FORMAT( a.CRTX_DATE, "%d-%m-%Y" )) AS LOGIN_TERAKHIR, c.NAMA_GRUP FROM tb01_lgxh a LEFT JOIN user_grupuser c ON a.GRUP_MENU = c.KDXX_GRUP ORDER BY a.CRTX_DATE DESC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPenggunaMenu = (req, res) => {
      var sql = `SELECT a.*, a.PROC_CODE AS PROG_KODE, b.*, c.ACCU_ADDX, c.ACCU_EDIT, c.ACCU_DELT, c.ACCU_INQU, c.ACCU_PRNT, c.ACCU_EXPT FROM tb00_menus a LEFT JOIN user_usermenus c ON a.PROC_CODE = c.PROC_CODE AND c.USER_IDXX = '${req.params.id}' LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE ORDER BY a.PROC_CODE DESC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getPenggunaGrup = (req, res) => {
      var sql = `SELECT a.*, b.* FROM tb01_lgxh a LEFT JOIN user_grupuser b ON a.GRUP_MENU = b.KDXX_GRUP WHERE a.USER_IDXX = '${req.params.id}'`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getDetailPengguna = (req, res) => {
      var sql = `SELECT a.*, b.* FROM tb01_lgxh a LEFT JOIN user_grupuser b ON a.GRUP_MENU = b.KDXX_GRUP WHERE a.USER_IDXX = '${req.params.id}'`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }


    getCekPengguna = (req, res) => {
      var sql = `SELECT * FROM tb01_lgxh WHERE USER_IDXX = '${req.params.id}'`
  
      db.query(sql, function (err, rows, fields) {
        if (rows != "") {
          res.send({
            cekUser : 'ADA',
          });
        }else{
          res.send({
            cekUser : 'TIDAK',
          });
        }
      });
    }

    getDetailGrupUser = (req, res) => {
      var sql = `SELECT a.* FROM user_grupuser a WHERE KDXX_GRUP = '${req.params.id}'`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    getDetailMenuGrupUser = (req, res) => {
      var sql = `SELECT a.*, a.PROC_CODE AS PROG_KODE, b.*, c.ACCS_ADDX, c.ACCS_EDIT, c.ACCS_DELT, c.ACCS_INQU, c.ACCS_PRNT, c.ACCS_EXPT, c.KDXX_GRUP FROM tb00_menus a LEFT JOIN user_grupmenus c ON a.PROC_CODE = c.PROC_CODE AND c.KDXX_GRUP = '${req.params.id}' LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE ORDER BY a.PROC_CODE DESC`
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    generateNumberGrupUser = (req, res) => {
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tahun = date.format(now,"YYYY");
      const tglReplace = tgl.replace(/-/g,"").toString();

      var sql = `SELECT MAX(RIGHT(a.KDXX_GRUP, 3)) AS URUTX FROM user_grupuser a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;

      db.query(sql, function (err, rows, fields) {
        rows.map((data) => {
          if (data['URUTX'] == null) {
            var noGrupUser = `G${tglReplace}001`;

            res.send({
              idGrupUser : noGrupUser,
            });
          } else {
            var no = parseInt(data['URUTX']) + 1;
            var noGrupUser = 'G' + tglReplace + no.toString().padStart(3,"0");
            
            res.send({
              idGrupUser : noGrupUser,
            });
          }
        });
      });
    }

    saveGrupUser = (req, res) => {
      var qry = `INSERT INTO user_grupuser SET ?`;
      var data = {
        KDXX_GRUP : req.body.KDXX_GRUP,
        NAMA_GRUP : req.body.NAMA_GRUP,
        KETERANGAN : req.body.KETERANGAN,
        STAS_GRUP : '1',
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'superadmin'
      };
  
      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
            var detailAkses = req.body.DETX_GRUP;
            var jsonAkses = JSON.parse(detailAkses);
            var sts;
            
            for (let i = 0; i < jsonAkses.length; i++) {
              var qryIns = `INSERT INTO user_grupmenus SET ?`;
              var dataIns = {
                KDXX_GRUP : jsonAkses[i]['KDXX_GRUP'],
                PROC_CODE : jsonAkses[i]['PROC_CODE'],
                ACCS_ADDX : jsonAkses[i]['ACCS_ADDX'] == 'true' ? '1' : '0',
                ACCS_EDIT : jsonAkses[i]['ACCS_EDIT'] == 'true' ? '1' : '0',
                ACCS_DELT : jsonAkses[i]['ACCS_DELT'] == 'true' ? '1' : '0',
                ACCS_INQU : jsonAkses[i]['ACCS_INQU'] == 'true' ? '1' : '0',
                ACCS_PRNT : jsonAkses[i]['ACCS_PRNT'] == 'true' ? '1' : '0',
                ACCS_EXPT : jsonAkses[i]['ACCS_EXPT'] == 'true' ? '1' : '0',
                CRTX_DATE : new Date(),
                CRTX_BYXX : 'superadmin'
              };   

              db.query(qryIns, dataIns, (err, result) => {
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

    updateGrupUser = (req, res) => {
      // var qry = `INSERT INTO user_grupuser SET ?`;
      var sql = `UPDATE user_grupuser SET ? WHERE KDXX_GRUP = "${req.body.KDXX_GRUP}" `;

      var data = {
        KDXX_GRUP : req.body.KDXX_GRUP,
        NAMA_GRUP : req.body.NAMA_GRUP,
        KETERANGAN : req.body.KETERANGAN,
        STAS_GRUP : req.body.STAS_GRUP,
        UPDT_DATE : new Date(),
        UPDT_BYXX : 'superadmin'
      };
  
      db.query(sql, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          var sql = `DELETE FROM user_grupmenus WHERE KDXX_GRUP = '${req.body.KDXX_GRUP}'`;

          db.query(sql, (err, result) => {
            if (err) {
              console.log('Error', err);
      
              res.send({
                status: false,
                message: err.sqlMessage
              });
            } else {
              var detailAkses = req.body.DETX_GRUP;
              var jsonAkses = JSON.parse(detailAkses);
              var sts;

              for (let i = 0; i < jsonAkses.length; i++) {
                var qryIns = `INSERT INTO user_grupmenus SET ?`;
                var dataIns = {
                  KDXX_GRUP : jsonAkses[i]['KDXX_GRUP'],
                  PROC_CODE : jsonAkses[i]['PROC_CODE'],
                  ACCS_ADDX : jsonAkses[i]['ACCS_ADDX'] == 'true' ? '1' : '0',
                  ACCS_EDIT : jsonAkses[i]['ACCS_EDIT'] == 'true' ? '1' : '0',
                  ACCS_DELT : jsonAkses[i]['ACCS_DELT'] == 'true' ? '1' : '0',
                  ACCS_INQU : jsonAkses[i]['ACCS_INQU'] == 'true' ? '1' : '0',
                  ACCS_PRNT : jsonAkses[i]['ACCS_PRNT'] == 'true' ? '1' : '0',
                  ACCS_EXPT : jsonAkses[i]['ACCS_EXPT'] == 'true' ? '1' : '0',
                  CRTX_DATE : new Date(),
                  CRTX_BYXX : 'superadmin'
                };   

                db.query(qryIns, dataIns, (err, result) => {
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
      });
    }

    saveFotoPengguna = (req, res) => {
      var fotoUser = req.body.FOTO_USER;
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tglReplace = tgl.replace(/-/g,"").toString();

      if (fotoUser != 'TIDAK') {
        var fotoUserName = req.body.USER_IDXX + tglReplace + '.png';
        fs.writeFile(`uploads/profil/${fotoUserName}`, fotoUser, { encoding: 'base64' }, function (err) {
          if (err) {
            console.log('FOTO GAGAL DIUPLOAD', err);
          } else {
            console.log('FOTO BERHASIL DIUPLOAD');
          }
        });
  
        var namaFoto = fotoUserName;
      } else {
        var namaFoto = 'KOSONG';
      }

      res.send({
        status: true,
        foto: namaFoto,
      });
    }

    updateFotoPengguna = (req, res) => {
      var fotoUser = req.body.FOTO_USER;
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tglReplace = tgl.replace(/-/g,"").toString();

      var fotoLama = req.body.FOTO_LAMA;
      if (fotoLama != '') {
        if (req.body.FOTO_USER == 'TIDAK') {
          var namaFoto = fotoLama;
        } else {
          fs.unlink(`uploads/profil/${fotoLama}`, function (err) {
            if (err) return console.log(err);
            console.log('FOTO LAMA BERHASIL DIHAPUS');
          });

          var fotoUser = req.body.FOTO_USER;
          var fotoUserName = req.body.USER_IDXX + tglReplace + '.png';
          fs.writeFile(`uploads/profil/${fotoUserName}`, fotoUser, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('FOTO BARU GAGAL DIUPLOAD' ,err);
            } else {
              console.log('FOTO BARU BERHASIL DIUPLOAD');
            }
          });
          var namaFoto = fotoUserName;
        }
      } else {
        if (req.body.FOTO_USER == 'TIDAK') {
          var namaFoto = '';
        } else {
          var fotoUser = req.body.FOTO_USER;
          var fotoUserName = req.body.USER_IDXX + tglReplace + '.png';
          fs.writeFile(`uploads/profil/${fotoUserName}`, fotoUser, { encoding: 'base64' }, function (err) {
            if (err) {
              console.log('FOTO BARU GAGAL DIUPLOAD', err);
            } else {
              console.log('FOTO BARU BERHASIL DIUPLOAD');
            }
          });

          var namaFoto = fotoUserName;
        }
      }
        
      res.send({
        status: true,
        foto: namaFoto,
      });
    }

    updatePengguna = function (req, res) {  
      var sql = `UPDATE tb01_lgxh SET ? WHERE USER_IDXX = '${req.body.USER_IDXX}'`;
      var data = {
        USER_IDXX: req.body.USER_IDXX,
        PASS_IDXX: req.body.USER_PASS,
        KETX_USER: req.body.NAME_USER,
        GRUP_MENU: req.body.GRUP_MENU,
        BUSS_CODE: 'QU001',
        Active: req.body.Active,
        IsValid: "1",
        Email: req.body.EMAIL,
        TYPE_PRSON: '4',
        NamaFile: req.body.FOTO_USER == 'KOSONG' ? null : req.body.FOTO_USER,
        UPDT_DATE: new Date(),
        UPDT_BYXX: 'superadmin',
      };
  
      db.query(sql, data, (err, result) => {
        if (err) {
          console.log("Error", err);
  
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          res.send({
            status: true,
          });
          // var sql = `DELETE FROM user_usermenus WHERE USER_IDXX = '${req.body.USER_IDXX}'`;
          // db.query(sql, (err, result) => {
          //   if (err) {
          //     console.log('Error', err);
      
          //     res.send({
          //       status: false,
          //       message: err.sqlMessage
          //     });
          //   } else {

          //   }
          // });
          // var sts;
          // var sql = `SELECT * FROM user_grupmenus WHERE KDXX_GRUP = '${req.body.GRUP_MENU}'`;
          // db.query(sql, function (err, rows, fields) {
          //   rows.map((e) => {
          //     var qryIns = `INSERT INTO user_usermenus SET ?`;
          //     var dataIns = {
          //       USER_IDXX : req.body.USER_IDXX,
          //       PROC_CODE : e['PROC_CODE'],
          //       ACCU_ADDX : e['ACCS_ADDX'],
          //       ACCU_EDIT : e['ACCS_EDIT'],
          //       ACCU_DELT : e['ACCS_DELT'],
          //       ACCU_INQU : e['ACCS_INQU'],
          //       ACCU_PRNT : e['ACCS_PRNT'],
          //       ACCU_EXPT : e['ACCS_EXPT'],
          //       CRTX_DATE : new Date(),
          //       CRTX_BYXX : 'superadmin'
          //     };   
  
          //     db.query(qryIns, dataIns, (err, result) => {
          //       if (err) {
          //           sts = false;
          //       } else {
          //           sts = true;
          //       }
          //     });
          //   })
  
          //   res.send({
          //     status: true,
          //     token: token,
          //   });
          // });
        }
      });
    };
    
    updateAksesPengguna = (req, res) => {
      var sql = `DELETE FROM user_usermenus WHERE USER_IDXX = '${req.body.USER_IDXX}'`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log('Error', err);
  
          res.send({
            status: false,
            message: err.sqlMessage
          });
        } else {
          var detailAkses = req.body.DETX_MENU;
          var jsonAkses = JSON.parse(detailAkses);
          var sts;

          for (let i = 0; i < jsonAkses.length; i++) {
            var qryIns = `INSERT INTO user_usermenus SET ?`;
            var dataIns = {
              USER_IDXX : jsonAkses[i]['USER_IDXX'],
              PROC_CODE : jsonAkses[i]['PROC_CODE'],
              ACCU_ADDX : jsonAkses[i]['ACCU_ADDX'] == 'true' ? '1' : '0',
              ACCU_EDIT : jsonAkses[i]['ACCU_EDIT'] == 'true' ? '1' : '0',
              ACCU_DELT : jsonAkses[i]['ACCU_DELT'] == 'true' ? '1' : '0',
              ACCU_INQU : jsonAkses[i]['ACCU_INQU'] == 'true' ? '1' : '0',
              ACCU_PRNT : jsonAkses[i]['ACCU_PRNT'] == 'true' ? '1' : '0',
              ACCU_EXPT : jsonAkses[i]['ACCU_EXPT'] == 'true' ? '1' : '0',
              CRTX_DATE : new Date(),
              CRTX_BYXX : 'superadmin'
            };   

            db.query(qryIns, dataIns, (err, result) => {
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
}