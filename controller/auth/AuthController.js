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
                    sql = 'INSERT INTO tb21_empl SET ?';

                    data = {
                        KodeNik : req.body.KodeNik,
                        NamaKry : req.body.NamaKry,
                        email : req.body.Email,
                        StatusAktif : req.body.StatusAktif,
                        CRTX_DATE : new Date(),
                        CRTX_BYXX : req.body.USER_IDXX
                    };

                    db.query(sql, data, (err, result) => {
                        res.send({
                            status: true,
                            token: token
                        });
                    });
                }
            });
        }

        signin = function(req, res) {
            var sql = 'select * from tb01_lgxh where USER_IDXX = "' + req.body.USER_IDXX + '" And Active = "1" And IsValid = "1" And BUSS_CODE = "' + req.body.BUSS_CODE + '"';
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
                        var token = jwt.sign({ id: user.USER_IDXX }, config.secret, {
                          expiresIn: ca.config.TokenExpired   
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
            var path = req.url;
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
                
                // get User Access
                var sql = 'SELECT a.*, c.IsValid, d.KODE_URUT FROM `tb01_usrd` a INNER JOIN `tb01_apix` b on a.PROC_CODE = b.PROC_CODE INNER JOIN `tb01_lgxh` c ON a.USER_IDXX = c.USER_IDXX INNER JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT WHERE a.USER_IDXX = "' + decoded.id + '" And ("' + path + '%" like CONCAT(b.PATH,"%") Or "' + path + '%/" like CONCAT(b.PATH,"%")) ORDER BY b.PATH';  
                
                db.query(sql, (err, rows) => {
                    if (err)
                        throw err;

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
                            next();
                        }
                    } else {
                        const pathPermit = ['/profile', '/', '/menu/menus', '/uploadFile2', '/user/update'];

                        if (pathPermit.includes(path)) {
                            next();
                        } else {
                            return res.status(403).send({ 
                                status: false, 
                                message: 'Access Denied',
                                userAccess: false
                            });
                        }
                    }
                });
            });
        }
}