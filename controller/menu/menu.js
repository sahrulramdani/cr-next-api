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
    var sql = `SELECT a.*, b.*, c.MDUL_CODE FROM tb01_listsubmenus a LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE LEFT JOIN tb01_submenus c ON a.SUBMENU_CODE = c.SUBMENU_CODE`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getTypeAll = (req, res) => {
    var sql = `SELECT MDUL_CODE, MENU_NAME FROM tb01_menus WHERE MDUL_CODE != 'LGT'`

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
    var sql = `SELECT a.*, a.LIST_CODE AS PROG_CODE, b.*, c.MDUL_CODE, d.ACCU_ADDX, d.ACCU_EDIT, d.ACCU_DELT, d.ACCU_INQU, d.ACCU_PRNT, d.ACCU_EXPT FROM tb01_listsubmenus a LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE LEFT JOIN tb01_submenus c ON a.SUBMENU_CODE = c.SUBMENU_CODE LEFT JOIN user_usermenus d ON a.LIST_CODE = d.PROC_CODE AND d.USER_IDXX = '${req.params.id}'`

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
          cekUser: 'ADA',
        });
      } else {
        res.send({
          cekUser: 'TIDAK',
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
    var sql = `SELECT a.*, a.LIST_CODE AS PROG_CODE, b.*, c.MDUL_CODE, d.ACCS_ADDX, d.ACCS_EDIT, d.ACCS_DELT, d.ACCS_INQU, d.ACCS_PRNT, d.ACCS_EXPT, d.KDXX_GRUP FROM tb01_listsubmenus a LEFT JOIN tb00_procmenus b ON a.TYPE_MDUL = b.KDXX_TYPE LEFT JOIN tb01_submenus c ON a.SUBMENU_CODE = c.SUBMENU_CODE LEFT JOIN user_grupmenus d ON a.LIST_CODE = d.PROC_CODE AND d.KDXX_GRUP = '${req.params.id}'`

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDetailUserGrupUser = (req, res) => {
    var sql = `SELECT a.*, IFNULL(DATE_FORMAT( (SELECT MAX(b.START_DATE) FROM history_login b WHERE b.USER_IDXX = a.USER_IDXX), "%d-%m-%Y" ), DATE_FORMAT( a.CRTX_DATE, "%d-%m-%Y" )) AS LOGIN_TERAKHIR, c.NAMA_GRUP FROM tb01_lgxh a LEFT JOIN user_grupuser c ON a.GRUP_MENU = c.KDXX_GRUP WHERE a.GRUP_MENU = '${req.params.id}' ORDER BY a.CRTX_DATE DESC`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  generateNumberGrupUser = (req, res) => {
    const now = new Date();
    const tgl = date.format(now, "YYYY-MM-DD");
    const tahun = date.format(now, "YYYY");
    const tglReplace = tgl.replace(/-/g, "").toString();

    var sql = `SELECT MAX(RIGHT(a.KDXX_GRUP, 3)) AS URUTX FROM user_grupuser a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;

    db.query(sql, function (err, rows, fields) {
      rows.map((data) => {
        if (data['URUTX'] == null) {
          var noGrupUser = `G${tglReplace}001`;

          res.send({
            idGrupUser: noGrupUser,
          });
        } else {
          var no = parseInt(data['URUTX']) + 1;
          var noGrupUser = 'G' + tglReplace + no.toString().padStart(3, "0");

          res.send({
            idGrupUser: noGrupUser,
          });
        }
      });
    });
  }

  saveGrupUser = (req, res) => {
    var qry = `INSERT INTO user_grupuser SET ?`;
    var data = {
      KDXX_GRUP: req.body.KDXX_GRUP,
      NAMA_GRUP: req.body.NAMA_GRUP,
      KETERANGAN: req.body.KETERANGAN,
      STAS_GRUP: '1',
      CRTX_DATE: new Date(),
      CRTX_BYXX: 'superadmin'
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
            KDXX_GRUP: jsonAkses[i]['KDXX_GRUP'],
            PROC_CODE: jsonAkses[i]['PROC_CODE'],
            ACCS_ADDX: jsonAkses[i]['ACCS_ADDX'] == 'true' ? '1' : '0',
            ACCS_EDIT: jsonAkses[i]['ACCS_EDIT'] == 'true' ? '1' : '0',
            ACCS_DELT: jsonAkses[i]['ACCS_DELT'] == 'true' ? '1' : '0',
            ACCS_INQU: jsonAkses[i]['ACCS_INQU'] == 'true' ? '1' : '0',
            ACCS_PRNT: jsonAkses[i]['ACCS_PRNT'] == 'true' ? '1' : '0',
            ACCS_EXPT: jsonAkses[i]['ACCS_EXPT'] == 'true' ? '1' : '0',
            CRTX_DATE: new Date(),
            CRTX_BYXX: 'superadmin'
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
          status: true
        });
      }
    });
  }

  updateGrupUser = (req, res) => {
    // var qry = `INSERT INTO user_grupuser SET ?`;
    var sql = `UPDATE user_grupuser SET ? WHERE KDXX_GRUP = "${req.body.KDXX_GRUP}" `;

    var data = {
      KDXX_GRUP: req.body.KDXX_GRUP,
      NAMA_GRUP: req.body.NAMA_GRUP,
      KETERANGAN: req.body.KETERANGAN,
      STAS_GRUP: req.body.STAS_GRUP,
      UPDT_DATE: new Date(),
      UPDT_BYXX: 'superadmin'
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
                KDXX_GRUP: jsonAkses[i]['KDXX_GRUP'],
                PROC_CODE: jsonAkses[i]['PROC_CODE'],
                ACCS_ADDX: jsonAkses[i]['ACCS_ADDX'] == 'true' ? '1' : '0',
                ACCS_EDIT: jsonAkses[i]['ACCS_EDIT'] == 'true' ? '1' : '0',
                ACCS_DELT: jsonAkses[i]['ACCS_DELT'] == 'true' ? '1' : '0',
                ACCS_INQU: jsonAkses[i]['ACCS_INQU'] == 'true' ? '1' : '0',
                ACCS_PRNT: jsonAkses[i]['ACCS_PRNT'] == 'true' ? '1' : '0',
                ACCS_EXPT: jsonAkses[i]['ACCS_EXPT'] == 'true' ? '1' : '0',
                CRTX_DATE: new Date(),
                CRTX_BYXX: 'superadmin'
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
              status: true
            });
          }
        });
      }
    });
  }

  saveFotoPengguna = (req, res) => {
    var fotoUser = req.body.FOTO_USER;
    const now = new Date();
    const tgl = date.format(now, "YYYY-MM-DD");
    const tglReplace = tgl.replace(/-/g, "").toString();

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
    const tgl = date.format(now, "YYYY-MM-DD");
    const tglReplace = tgl.replace(/-/g, "").toString();

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
            console.log('FOTO BARU GAGAL DIUPLOAD', err);
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
            USER_IDXX: jsonAkses[i]['USER_IDXX'],
            PROC_CODE: jsonAkses[i]['PROC_CODE'],
            ACCU_ADDX: jsonAkses[i]['ACCU_ADDX'] == 'true' ? '1' : '0',
            ACCU_EDIT: jsonAkses[i]['ACCU_EDIT'] == 'true' ? '1' : '0',
            ACCU_DELT: jsonAkses[i]['ACCU_DELT'] == 'true' ? '1' : '0',
            ACCU_INQU: jsonAkses[i]['ACCU_INQU'] == 'true' ? '1' : '0',
            ACCU_PRNT: jsonAkses[i]['ACCU_PRNT'] == 'true' ? '1' : '0',
            ACCU_EXPT: jsonAkses[i]['ACCU_EXPT'] == 'true' ? '1' : '0',
            CRTX_DATE: new Date(),
            CRTX_BYXX: 'superadmin'
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
          status: true
        });
      }
    });
  }


  getSubmenuByMenu = (req, res) => {

    var sql = `SELECT a.MDUL_CODE, a.MENU_NAME, b.SUBMENU_CODE, b.SUBMENU_NAME FROM tb01_menus a LEFT JOIN tb01_submenus b  ON a.MDUL_CODE = b.MDUL_CODE WHERE a.MDUL_CODE = "${req.params.id}"`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getLIstMenuBySubMenu = (req, res) => {
    var sql = `SELECT a.SUBMENU_CODE, a.SUBMENU_NAME,a.MDUL_CODE, b.LIST_CODE, b.LIST_NAME, b.TYPE_MDUL FROM tb01_submenus a LEFT JOIN tb01_listsubmenus b ON a.SUBMENU_CODE = b.SUBMENU_CODE WHERE a.SUBMENU_CODE = "${req.params.id}"`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getlistMenus = (req, res) => {
    var sql = `SELECT a.MENU_NAME,a.PATH AS PATH_MENU,a.ICON_MENU,b.SUBMENU_CODE AS CODE_SUBMENU,b.SUBMENU_NAME,b.ICON_SUBMENU,c.SUBMENU_CODE AS CODE_LISTMENU,c.LIST_CODE,c.LIST_NAME,c.PATH AS PATH_LIST FROM tb01_menus a LEFT JOIN tb01_submenus b ON a.MDUL_CODE = b.MDUL_CODE LEFT JOIN tb01_listsubmenus c ON b.SUBMENU_CODE = c.SUBMENU_CODE WHERE a.MENU_NAME = '${req.params.nama}'`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
    // db.query(sql, function (err, rows, fields) {
    //   if (err) {
    //     throw err;
    //     return;
    //   }
    //   var output = [];
    //   var outputTemp = [];

    //   // sort NoUrut desc
    //   rows.sort((a, b) => {
    //     if (a.LIST_CODE > b.LIST_CODE) {
    //       return -1;
    //     } else if (a.LIST_CODE < b.LIST_CODE) {
    //       return 1;
    //     };

    //     return 0;
    //   });

    //   if (rows.length > 0) {
    //     rows.forEach(function (row) {
    //       var obj = new Object();
    //       for (var key in row) {
    //         obj[key] = row[key];
    //       }
    //       var check = outputTemp.filter(item => item.CODE_SUBMENU === obj.CODE_LISTMENU);
    //       if (check.length > 0) {
    //         // sort NoUrut Asc
    //         check.sort((a, b) => {
    //           if (a.LIST_CODE < b.LIST_CODE) {
    //             return -1;
    //           } else if (a.LIST_CODE > b.LIST_CODE) {
    //             return 1;
    //           };

    //           return 0;
    //         });

    //         obj.children = check;
    //       }
    //       outputTemp.push(obj);
    //     });

    //     output = outputTemp.filter(item => item.CODE_SUBMENU != null);
    //     // Sort NoUrut Asc
    //     output.sort((a, b) => {
    //       if (a.LIST_CODE < b.LIST_CODE) {
    //         return -1;
    //       } else if (a.LIST_CODE > b.LIST_CODE) {
    //         return 1;
    //       };

    //       return 0;
    //     });
    //   }
    //   res.send(output);
    // });

  }

  getMenu = (req, res) => {
    var sql = `SELECT a.MDUL_CODE, a.MENU_NAME AS SUBMENU_NAME, a.PATH, a.ICON_MENU FROM tb01_menus a WHERE a.MENU_NAME = '${req.params.nama}'`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getModuleAll = (req, res) => {
    var sql = `SELECT MENU_NAME,PATH, ICON_MENU FROM tb01_menus ORDER BY ID_MENU ASC`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getModuleByUser = (req, res) => {
    var sql = `SELECT DISTINCT a.MENU_NAME, a.PATH, a.ICON_MENU FROM tb01_menus a LEFT JOIN tb01_submenus b ON a.MDUL_CODE = b.MDUL_CODE LEFT JOIN tb01_listsubmenus c ON b.SUBMENU_CODE = c.SUBMENU_CODE LEFT JOIN user_usermenus d ON c.LIST_CODE = d.PROC_CODE WHERE d.USER_IDXX = '${req.params.id}' OR a.MDUL_CODE = 'DSR' OR a.MDUL_CODE = 'LGT' ORDER BY a.ID_MENU ASC`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getSubmenu = (req, res) => {
    var sql = `SELECT a.MDUL_CODE, a.MENU_NAME AS NAME, a.PATH, a.ICON_MENU AS ICON FROM tb01_menus a WHERE a.MENU_NAME = '${req.params.nama}'`;
    db.query(sql, function (err, rows, fields) {

      if (rows.length == 0) {
        var sqllistmenu = `SELECT a.SUBMENU_CODE, b.MDUL_CODE, c.MENU_NAME AS NAME, c.PATH, c.ICON_MENU AS ICON, b.LEVEL FROM tb01_listsubmenus a LEFT JOIN tb01_submenus b ON a.SUBMENU_CODE = b.SUBMENU_CODE LEFT JOIN tb01_menus c ON b.MDUL_CODE = c.MDUL_CODE WHERE a.LIST_NAME = "${req.params.nama}"`;

        db.query(sqllistmenu, function (err, rows, fields) {
          var menu = rows;
          rows.map(element => {
            var sqlsubmenu = `SELECT DISTINCT c.MDUL_CODE, c.SUBMENU_CODE AS CODE_SUBMENU, c.SUBMENU_NAME AS NAME, c.ICON_SUBMENU AS ICON, c.LEVEL FROM user_usermenus a LEFT JOIN tb01_listsubmenus b ON a.PROC_CODE = b.LIST_CODE LEFT JOIN tb01_submenus c ON b.SUBMENU_CODE = c.SUBMENU_CODE WHERE a.USER_IDXX = '${req.params.user}' AND c.MDUL_CODE = '${element["MDUL_CODE"]}'`;



            db.query(sqlsubmenu, function (err, rows, fields) {

              var submenu = menu.concat(rows);
              submenu.map(element => {
                Object.assign(element, { children: [] });
              });

              res.send(submenu);

            })

          })
        })
      } else {

        var menu = rows;
        rows.map(element => {
          var sqlsubmenu = `SELECT DISTINCT c.MDUL_CODE, c.SUBMENU_CODE AS CODE_SUBMENU, c.SUBMENU_NAME AS NAME, c.ICON_SUBMENU AS ICON, c.LEVEL FROM user_usermenus a LEFT JOIN tb01_listsubmenus b ON a.PROC_CODE = b.LIST_CODE LEFT JOIN tb01_submenus c ON b.SUBMENU_CODE = c.SUBMENU_CODE WHERE a.USER_IDXX = '${req.params.user}' AND c.MDUL_CODE = '${element["MDUL_CODE"]}'`;



          db.query(sqlsubmenu, function (err, rows, fields) {

            var submenu = menu.concat(rows);
            submenu.map(element => {
              Object.assign(element, { children: [] });
            });

            res.send(submenu);

          })

        })

      }


    });

  }
  getlistMenus = (req, res) => {
    var sql = `SELECT b.LIST_CODE, b.LIST_NAME AS NAME, b.PATH, b.ICON_LISTMENU AS ICON, b.SUBMENU_CODE, b.LEVEL FROM user_usermenus a LEFT JOIN tb01_listsubmenus b ON a.PROC_CODE = b.LIST_CODE WHERE a.USER_IDXX = '${req.params.user}'`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getTypeMdul = (req, res) => {
    var sql = `SELECT KDXX_TYPE FROM tb00_procmenus`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }



  saveMenu = (req, res) => {
    var sql = `SELECT MAX(ID_MENU) AS number FROM tb01_menus`;

    db.query(sql, function (err, rows, fields) {
      var number = parseInt(rows[0]["number"]) + 1;
      var idmenu = String(number).padStart(3, "0");

      var sqlInsert = `INSERT INTO tb01_menus SET ?`;
      var data = {
        ID_MENU: idmenu,
        MDUL_CODE: req.body.MDUL_CODE,
        MENU_NAME: req.body.MENU_NAME,
        PATH: req.body.PATH,
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
  }

  savesubMenu = (req, res) => {
    var idMenu = req.body.MDUL_CODE;

    var sql = `SELECT TRIMLETTERS(MAX(SUBMENU_CODE)) AS number FROM tb01_submenus WHERE MDUL_CODE = "${idMenu}"`;
    db.query(sql, function (err, rows, fields) {
      var number = parseInt(rows[0]['number']) + 1;
      var idSubmenu = idMenu + number;

      var sqlInsert = `INSERT INTO tb01_submenus SET ?`;
      var data = {
        MDUL_CODE: idMenu,
        SUBMENU_CODE: idSubmenu,
        SUBMENU_NAME: req.body.SUBMENU_NAME,
        LEVEL: "0",
        ICON_SUBEMNU: "0xe07a",
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
  }

  savelistMenu = (req, res) => {
    var idSubMenu = req.body.SUBMENU_CODE;
    var idMenu = req.body.ID_MENU;
    var sql = `SELECT TRIMLETTERS(MAX(SUBMENU_CODE)) AS NOURUT FROM tb01_listsubmenus WHERE SUBMENU_CODE = '${idSubMenu}'`;
    db.query(sql, function (err, rows, fields) {
      var nourut = parseInt(rows[0]["NOURUT"]) + 1;
      var idListMenu = idMenu + String(nourut).padStart(2, '0');

      var sqlInsert = `INSERT INTO tb01_listsubmenus SET ?`;

      var data = {
        SUBMENU_CODE: idSubMenu,
        LIST_CODE: idListMenu,
        LIST_NAME: req.body.LIST_NAME,
        PATH: req.body.PATH,
        TYPE_MDUL: req.body.TYPE_MDUL,
        LEVEL: "1",
        ICON_LISTMENU: "0xee36",
        CRTX_BYXX: 'alfi',
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
    });
  }
}
