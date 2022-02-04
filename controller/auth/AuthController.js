import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from './config.js';
import  db from './../../koneksi.js';
import * as ca  from './../../config.js';  // config application


export default class AuthController {
        register = function(req, res) {
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);

            var token = jwt.sign({ id: req.body.USER_IDXX }, config.secret, {
              expiresIn: ca.config.TokenExpired  
            });

            var sql = 'INSERT INTO tb01_lgxh SET ?';
            var data = {
                USER_IDXX : req.body.USER_IDXX,
                PASS_IDXX : hashedPassword,
                KETX_USER : req.body.KETX_USER,
                BUSS_CODE : req.body.BUSS_CODE,
                Active : req.body.Active,
                IsValid : req.body.IsValid,
                Email : req.body.Email,
                NO_ID : req.body.NO_ID,
                TYPE_PRSON : req.body.TYPE_PRSON,    
                CRTX_DATE : new Date(),
                CRTX_BYXX : req.body.USER_IDXX
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
                        status: true,
                        token: token
                    });
                }
            });
        }

        signin = function(req, res) {
            var sql = '';

            if (req.body.NotRequiredEntity === '1') {
                sql = 'select * from tb01_lgxh where UPPER(USER_IDXX) = "' + req.body.USER_IDXX.toUpperCase() + '" And Active = "1" And IsValid = "1"';
            } else {
                sql = 'select * from tb01_lgxh where UPPER(USER_IDXX) = "' + req.body.USER_IDXX.toUpperCase() + '" And Active = "1" And IsValid = "1" And BUSS_CODE = "' + req.body.BUSS_CODE + '"';
            }
            db.query(sql, (err, rows) => {
              if (err) {
                  console.log('Error', err);
  
                  res.send({
                      status: false,
                      message: err.sqlMessage
                  });
              } else {
                  if (rows.length > 0) {
                    var user = rows[0];
                    
                    var passwordIsValid = bcrypt.compareSync(req.body.password, user.PASS_IDXX);
                    if (!passwordIsValid) {
                        res.send({
                            status: false,
                            message: 'wrong password!'
                        });
                    } else {
                        var tokenExpiresIn = ca.config.TokenExpired;
                        
                        if (user.USER_IDXX === '00006') {
                            tokenExpiresIn = 1261440000;       // 40 tahun, utk Operator WA
                        } 

                        var token = jwt.sign({ id: user.USER_IDXX }, config.secret, {
                            expiresIn: tokenExpiresIn   
                        });

                        res.send({
                            status: true,
                            token: token
                        });
                    }
                  } else {
                    res.send({
                        status: false,
                        message: 'User Name not found or disabled or need verification!'
                    });
                  }
              }
          });
        }

        verifyToken = function(req, res, next) {
            var path = req.url.split('?')[0];
            var token = req.headers['x-access-token'];
            if (!token) {
              return res.status(403).send({ 
                        status: false, 
                        message: 'No token provided.',
                        auth: false
                    });
            }
              
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.status(500).send({ 
                            status: false,
                            auth: false, 
                            message: 'Failed to authenticate token.' 
                        });
                }
                    
                // if everything good, save to request for use in other routes
                req.userID = decoded.id;
                
                // potong parameter path
                var j = 0;
                for(var obj in req.params) {
                    j++;
                }
                
                if (j > 0) {
                    var pathArrays = path.split('/');
                    var pathLength = pathArrays.length;

                    path = '';
                    for(var i=0; i < pathLength-j; i++) {
                        if (i>0) {
                            path += '/' + pathArrays[i];
                        }
                    }
                }

                // get User Access
                var sql = 'SELECT a.*, c.IsValid, d.KODE_URUT, d.SequenceUnitCode, c.TYPE_PRSON, d.NAMA_UNIT, e.TypeRelawan, f.groupID, Case e.TypeRelawan When "04" Then g.KodeKelurahan When "03" Then g.KodeKecamatan When "02" Then SUBSTRING(KodeKecamatan,1,4) When "01" Then SUBSTRING(KodeKecamatan,1,2) Else "XXXX" End As KodeArea FROM `tb01_usrd` a INNER JOIN `tb01_apix` b on a.PROC_CODE = b.PROC_CODE INNER JOIN `tb01_lgxh` c ON a.USER_IDXX = c.USER_IDXX And a.BUSS_CODE = c.BUSS_CODE INNER JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT LEFT JOIN tb21_empl e ON c.NO_ID = e.KodeNik LEFT JOIN vfirst_relawandet f on e.KodeNik = f.RelawanID LEFT JOIN grpx_relx g ON f.groupID = g.IDXX_GRPX WHERE UPPER(a.USER_IDXX) = "' + decoded.id.toUpperCase() + '" And ("' + path + '" = b.PATH) And a.RIGH_AUTH = "1" And c.Active = "1" And c.IsValid = "1" ORDER BY b.PATH';  
                
                var procCodes = [];
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    } else {
                        if (rows.length > 0) {
                            var userAccess = rows[0];

                            var authRight = userAccess.RIGH_AUTH;
                            req.AUTH_ADDX = userAccess.AUTH_ADDX;
                            req.AUTH_EDIT = userAccess.AUTH_EDIT;
                            req.AUTH_DELT = userAccess.AUTH_DELT;
                            req.AUTH_APPR = userAccess.AUTH_APPR;
                            req.AUTH_PRNT = userAccess.AUTH_PRNT;

                            req.BUSS_CODE0 = userAccess.BUSS_CODE;
                            req.KODE_URUT0 = userAccess.KODE_URUT;
                            req.SequenceUnitCode0 = userAccess.SequenceUnitCode;
                            req.TYPE_PRSON0 = userAccess.TYPE_PRSON;
                            req.TypeRelawan0 = userAccess.TypeRelawan;
                            req.NAMA_UNIT0 = userAccess.NAMA_UNIT;
                            req.groupID = userAccess.groupID;
                            req.KODE_AREA0 = userAccess.KodeArea;

                            rows.forEach((item) => {
                                procCodes.push(item.PROC_CODE);
                            });

                            if (userAccess.IsValid === '0') {
                                return res.status(403).send({ 
                                    status: false, 
                                    message: 'Need Verification!',
                                    userAccess: false,
                                    isValid: false
                                });
                            }

                            if (authRight === '0') {
                                return res.status(403).send({ 
                                    status: false, 
                                    message: 'Access Denied',
                                    userAccess: false
                                });
                            } else {
                                req.procCodes = procCodes;
                                next();
                            }
                        } else {
                            // potong parameter path
                            path = req.url;
                            var j = 0;
                            for(var obj in req.params) {
                                j++;
                            }
                            
                            if (j > 0) {
                                var pathArrays = path.split('/');
                                var pathLength = pathArrays.length;

                                path = '';
                                for(var i=0; i < pathLength-j; i++) {
                                    if (i>0) {
                                        path += '/' + pathArrays[i];
                                    }
                                }
                            }

                            const pathPermit = ['/profile', '/', '/menu/menus', '/uploadFile2', '/user/update', '/profile/karyawan', '/profile/karyawan/update', '/profile/karyawan/save', '/profile/karyawan-prsh/save', '/setup/pekerjaans', '/setup/pendidikans', '/setup/status-maritals', '/setup/gol-darahs', '/utility/sequence', '/utility/sequence/save', '/utility/sequence/update', '/profile/user/update', '/setup/departments', '/user/privileges', '/profile/donatur/save', '/profile/donatur', '/profile/donatur/update', '/process/privilege'];

                            if (pathPermit.includes(path)) {
                                sql = 'select b.KODE_UNIT, b.SequenceUnitCode, b.KODE_URUT from tb01_lgxh a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where UPPER(a.USER_IDXX) = "' + decoded.id.toUpperCase() +  '" And a.Active = "1" And a.IsValid = "1"';

                                db.query(sql, (err, rows) => {
                                    if (rows.length > 0) {
                                        req.BUSS_CODE0 = rows[0].KODE_UNIT;
                                        req.SequenceUnitCode0 = rows[0].SequenceUnitCode;
                                        req.KODE_URUT0 = rows[0].KODE_URUT;

                                        next();
                                    }
                                });
                            } else {
                                return res.status(403).send({ 
                                    status: false, 
                                    message: 'Access Denied',
                                    userAccess: false
                                });
                            }
                        }
                    }
                });
            });
        }
}