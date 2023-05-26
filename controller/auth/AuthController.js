import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "./config.js";
import db from "./../../koneksi.js";
import * as ca from "./../../config.js"; // config application
import moment from "moment";

export default class AuthController {
  register = function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.USER_PASS, 8);

    var token = jwt.sign({ id: req.body.USER_IDXX }, config.secret, {
      expiresIn: ca.config.TokenExpired,
    });

    var sql = "INSERT INTO tb01_lgxh SET ?";
    var data = {
      USER_IDXX: req.body.USER_IDXX,
      PASS_IDXX: hashedPassword,
      KATX_USER: req.body.KATX_USER,
      KDXX_MRKT: req.body.KDXX_MRKT,
      UNIT_KNTR: req.body.UNIT_KNTR,
      KETX_USER: req.body.NAME_USER,
      GRUP_MENU: req.body.GRUP_MENU,
      ACTIVE: "1",
      IS_VALID: "1",
      EMAIL: req.body.EMAIL,
      NAMA_FILE: req.body.FOTO_USER == 'KOSONG' ? null : req.body.FOTO_USER,
      CRTX_DATE: new Date(),
      CRTX_BYXX: req.body.USER_IDXX,
    };

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log("Error", err);

        res.send({
          status: false,
          message: err.sqlMessage,
        });
      } else {
        var sts;
        var sql = `SELECT * FROM user_grupmenus WHERE KDXX_GRUP = '${req.body.GRUP_MENU}'`;
        db.query(sql, function (err, rows, fields) {
          rows.map((e) => {
            var qryIns = `INSERT INTO user_usermenus SET ?`;
            var dataIns = {
              USER_IDXX : req.body.USER_IDXX,
              PROC_CODE : e['PROC_CODE'],
              ACCU_ADDX : e['ACCS_ADDX'],
              ACCU_EDIT : e['ACCS_EDIT'],
              ACCU_DELT : e['ACCS_DELT'],
              ACCU_INQU : e['ACCS_INQU'],
              ACCU_PRNT : e['ACCS_PRNT'],
              ACCU_EXPT : e['ACCS_EXPT'],
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
          })

          res.send({
          status: true,
          token: token,
        });
        });
      }
    });
  };

  signin = function (req, res) {
    var sql = "";
    var data = {
      USER_LOGN: req.body.USER_LOGN,
      PASS_IDXX: req.body.PASS_IDXX,
      BUSS_CODE: req.body.BUSS_CODE,
    };

    // console.log('WKWKWKWKWK');
    // if (req.body.USER_LOGN!=='') {
    //     sql = 'select * from tb01_lgxh where (UPPER(USER_IDXX) = "' + req.body.USER_IDXX.toUpperCase() + '" Or (Alias Is Not Null And UPPER(Alias) = "' + req.body.USER_IDXX.toUpperCase() + '")) And Active = "1" And IsValid = "1"';
    // } else {
    //     sql = 'select * from tb01_lgxh where (UPPER(USER_IDXX) = "' + req.body.USER_IDXX.toUpperCase() + '" Or (Alias Is Not Null And UPPER(Alias) = "' + req.body.USER_IDXX.toUpperCase() + '")) And Active = "1" And IsValid = "1" And BUSS_CODE = "' + req.body.BUSS_CODE + '"';
    // }

    if (req.body.USER_LOGN !== "") {
      sql = `select * from tb01_lgxh where (UPPER(USER_IDXX) = '${req.body.USER_LOGN.toUpperCase()}' Or (ALIAS Is Not Null And UPPER(ALIAS) = '${req.body.USER_LOGN.toUpperCase()}')) And ACTIVE = "1" And IS_VALID = "1";`;
    }

    db.query(sql, (err, rows) => {
      if (err) {
        console.log("Error", err);

        res.send({
          status: false,
          message: err.sqlMessage,
        });
      } else {
        if (rows.length > 0) {
          var user = rows[0];

          var passwordIsValid = bcrypt.compareSync(
            req.body.PASS_IDXX,
            user.PASS_IDXX
          );
          if (!passwordIsValid) {
            res.send({
              status: false,
              message: "wrong password!",
            });
          } else {
            var tokenExpiresIn = ca.config.TokenExpired;

            if (user.USER_IDXX === "00006") {
              tokenExpiresIn = 1261440000; // 40 tahun, utk Operator WA
            }

            // if (req.body.NotRequiredEntity === '1' && req.body.checkRememberMe === '1') {
            //     tokenExpiresIn = 1261440000;       // 40 tahun
            // }

            var token = jwt.sign({ id: user.USER_IDXX }, config.secret, {
              expiresIn: tokenExpiresIn,
            });

            // // write Start Login
            var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            // sql = 'update tb01_lgxh set LOGN_STRT = "' + tgl + '", IpAddress = "' + req.body.IpAddress + '" where USER_IDXX = "' + user.USER_IDXX + '"';

            // db.query(sql, (err, rows) => {
            // });

            // write history login
            sql = 'insert into history_login (USER_IDXX, START_DATE, IP_ADDRESS) values ("' + user.USER_IDXX + '", "' + tgl + '", "LOGIN")';

            db.query(sql, (err, rows) => {
            });

            res.send({
              status: true,
              token: token,
              namaUser : rows[0]['KETX_USER'],
              username : rows[0]['USER_IDXX'],
              fotoUser : rows[0]['NAMA_FILE'],
              kodeAgen : rows[0]['KDXX_MRKT'],
            });
          }
        } else {
          res.send({
            status: false,
            message: "User Name not found or disabled or need verification!",
          });
        }
      }
    });
  };

  verifyToken = function (req, res, next) {
    var token = req.headers["pte-token"];
    if (!token) {
      return res.status(403).send({
        status: false,
        message: "No token provided.",
        auth: false,
      });
    }

    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(500).send({
          status: false,
          auth: false,
          message: "Failed to authenticate token.",
        });
      }

      // if everything good, save to request for use in other routes
      req.userID = decoded.id;
      next();
    });
  };

  getPermission = async (req, res) => {
    var sql = `SELECT a.* FROM user_usermenus a WHERE a.PROC_CODE = '${req.params.kode}' AND a.USER_IDXX = '${req.params.id}'`;

    db.query(sql, function (err, rows, fields) {
      var AUTH_ADD = '0';
      var AUTH_EDIT = '0';
      var AUTH_DEL = '0';
      var AUTH_INQ = '0';
      var AUTH_PRINT = '0';
      var AUTH_EXPORT = '0';

      rows.map((e) => {
        AUTH_ADD = e['ACCU_ADDX'] ?? '0';
        AUTH_EDIT = e['ACCU_EDIT'] ?? '0';
        AUTH_DEL = e['ACCU_DELT'] ?? '0';
        AUTH_INQ = e['ACCU_INQU'] ?? '0';
        AUTH_PRINT = e['ACCU_PRNT'] ?? '0';
        AUTH_EXPORT = e['ACCU_EXPT'] ?? '0';
      })

      res.send({
        AUTH_ADDX : AUTH_ADD,
        AUTH_EDIT : AUTH_EDIT,
        AUTH_DELT : AUTH_DEL,
        AUTH_INQU : AUTH_INQ,
        AUTH_PRNT : AUTH_PRINT,
        AUTH_EXPT : AUTH_EXPORT,
      })
    });

      // res.send({
      //   AUTH_ADDX : '1',
      //   AUTH_EDIT : '1',
      //   AUTH_DELT : '1',
      //   AUTH_INQU : '1',
      //   AUTH_PRNT : '1',
      //   AUTH_EXPT : '1',
      // })
  };

  //---------------------------------------------------------------------
  //Backup verifyToken
  //---------------------------------------------------------------------
  // verifyToken = function(req, res, next) {
  //     var path = req.url.split('?')[0];
  //     var token = req.headers['x-access-token'];
  //     if (!token) {
  //       return res.status(403).send({
  //                 status: false,
  //                 message: 'No token provided.',
  //                 auth: false
  //             });
  //     }

  //     jwt.verify(token, config.secret, function(err, decoded) {
  //         if (err) {
  //             return res.status(500).send({
  //                     status: false,
  //                     auth: false,
  //                     message: 'Failed to authenticate token.'
  //                 });
  //         }

  //         // if everything good, save to request for use in other routes
  //         req.userID = decoded.id;

  //         // potong parameter path
  //         var j = 0;
  //         for(var obj in req.params) {
  //             j++;
  //         }

  //         if (j > 0) {
  //             var pathArrays = path.split('/');
  //             var pathLength = pathArrays.length;

  //             path = '';
  //             for(var i=0; i < pathLength-j; i++) {
  //                 if (i>0) {
  //                     path += '/' + pathArrays[i];
  //                 }
  //             }
  //         }

  //         // get User Access
  //         var sql = 'SELECT a.*, c.IsValid, d.KODE_URUT, d.SequenceUnitCode, c.TYPE_PRSON, d.NAMA_UNIT, e.TypeRelawan, f.groupID, Case e.TypeRelawan When "04" Then g.KodeKelurahan When "03" Then g.KodeKecamatan When "02" Then h.KOTA_IDXX When "01" Then h.PROV_IDXX Else "XXX X" End As KodeArea, g.KODE_URUT As KodeUrutGroup FROM `tb01_usrd` a INNER JOIN `tb01_apix` b on a.PROC_CODE = b.PROC_CODE INNER JOIN `tb01_lgxh` c ON a.USER_IDXX = c.USER_IDXX And a.BUSS_CODE = c.BUSS_CODE INNER JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT LEFT JOIN tb21_empl e ON c.NO_ID = e.KodeNik LEFT JOIN vfirst_relawandet f on e.KodeNik = f.RelawanID LEFT JOIN grpx_relx g ON f.groupID = g.IDXX_GRPX LEFT JOIN tb20_area h on g.KodeKelurahan = h.AREA_IDXX WHERE UPPER(a.USER_IDXX) = "' + decoded.id.toUpperCase() + '" And ("' + path + '" = b.PATH) And a.RIGH_AUTH = "1" And c.Active = "1" And c.IsValid = "1" ORDER BY b.PATH';

  //         var procCodes = [];
  //         db.query(sql, (err, rows) => {
  //             if (err) {
  //                 throw err;
  //             } else {
  //                 if (rows.length > 0) {
  //                     var userAccess = rows[0];

  //                     var authRight = userAccess.RIGH_AUTH;
  //                     req.AUTH_ADDX = userAccess.AUTH_ADDX;
  //                     req.AUTH_EDIT = userAccess.AUTH_EDIT;
  //                     req.AUTH_DELT = userAccess.AUTH_DELT;
  //                     req.AUTH_APPR = userAccess.AUTH_APPR;
  //                     req.AUTH_PRNT = userAccess.AUTH_PRNT;   // access utk print atau export file

  //                     req.BUSS_CODE0 = userAccess.BUSS_CODE;
  //                     req.KODE_URUT0 = userAccess.KODE_URUT;
  //                     req.SequenceUnitCode0 = userAccess.SequenceUnitCode;
  //                     req.TYPE_PRSON0 = userAccess.TYPE_PRSON;
  //                     req.TypeRelawan0 = userAccess.TypeRelawan;
  //                     req.NAMA_UNIT0 = userAccess.NAMA_UNIT;
  //                     req.groupID = userAccess.groupID;
  //                     req.KODE_URUT_GROUP0 = userAccess.KodeUrutGroup;
  //                     req.KODE_AREA0 = userAccess.KodeArea;

  //                     rows.forEach((item) => {
  //                         procCodes.push(item.PROC_CODE);
  //                     });

  //                     if (userAccess.IsValid === '0') {
  //                         return res.status(403).send({
  //                             status: false,
  //                             message: 'Need Verification!',
  //                             userAccess: false,
  //                             isValid: false
  //                         });
  //                     }

  //                     if (authRight === '0') {
  //                         return res.status(403).send({
  //                             status: false,
  //                             message: 'Access Denied',
  //                             userAccess: false
  //                         });
  //                     } else {
  //                         req.procCodes = procCodes;
  //                         next();
  //                     }
  //                 } else {
  //                     // potong parameter path
  //                     path = req.url;
  //                     var j = 0;
  //                     for(var obj in req.params) {
  //                         j++;
  //                     }

  //                     if (j > 0) {
  //                         var pathArrays = path.split('/');
  //                         var pathLength = pathArrays.length;

  //                         path = '';
  //                         for(var i=0; i < pathLength-j; i++) {
  //                             if (i>0) {
  //                                 path += '/' + pathArrays[i];
  //                             }
  //                         }
  //                     }

  //                     const pathPermit = ['/profile', '/', '/menu/menus', '/uploadFile2', '/user/update', '/profile/karyawan', '/profile/karyawan/update', '/profile/karyawan/save', '/profile/karyawan-prsh/save', '/setup/pekerjaans', '/setup/pendidikans', '/setup/status-maritals', '/setup/gol-darahs', '/utility/sequence', '/utility/sequence/save', '/utility/sequence/update', '/profile/user/update', '/setup/departments', '/user/privileges', '/profile/donatur/save', '/profile/donatur', '/profile/donatur/update', '/process/privilege'];

  //                     if (pathPermit.includes(path)) {
  //                         sql = 'select b.KODE_UNIT, b.SequenceUnitCode, b.KODE_URUT, c.groupID, e.TypeRelawan, Case e.TypeRelawan When "04" Then d.KodeKelurahan When "03" Then d.KodeKecamatan When "02" Then f.KOTA_IDXX When "01" Then f.PROV_IDXX Else "XXX X" End As KodeArea, a.TYPE_PRSON from tb01_lgxh a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawandet c on a.NO_ID = c.RelawanID left join grpx_relx d ON c.groupID = d.IDXX_GRPX left join tb21_empl e on a.NO_ID = e.KodeNik left join tb20_area f on d.KodeKelurahan = f.AREA_IDXX where UPPER(a.USER_IDXX) = "' + decoded.id.toUpperCase() +  '" And a.Active = "1" And a.IsValid = "1"';

  //                         db.query(sql, (err, rows) => {
  //                             if (rows.length > 0) {
  //                                 req.BUSS_CODE0 = rows[0].KODE_UNIT;
  //                                 req.SequenceUnitCode0 = rows[0].SequenceUnitCode;
  //                                 req.KODE_URUT0 = rows[0].KODE_URUT;
  //                                 req.groupID = rows[0].groupID;
  //                                 req.TYPE_PRSON0 = rows[0].TYPE_PRSON;
  //                                 req.TypeRelawan0 = rows[0].TypeRelawan;
  //                                 req.KODE_AREA0 = rows[0].KodeArea;

  //                                 next();
  //                             }
  //                         });
  //                     } else {
  //                         return res.status(403).send({
  //                             status: false,
  //                             message: 'Access Denied',
  //                             userAccess: false
  //                         });
  //                     }
  //                 }
  //             }
  //         });
  //     });
  // }
  //Backup verifyToken
  //---------------------------------------------------------------------
}
