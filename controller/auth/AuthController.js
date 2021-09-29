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
                Active : req.body.Active
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
            var sql = 'select * from tb01_lgxh where USER_IDXX = "' + req.body.USER_IDXX + '" And Active = "1"';
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
                        message: 'User Name not found or disabled!'
                    });
                  }
              }
          });
        }

        /* verifyToken = function(req, res, next) {
            try {
                var abc= await verifyToken2(req, res, next);
            } catch (e) {

            }
        } */

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
                var sql = 'SELECT a.* FROM `tb01_usrd` a INNER JOIN `tb01_lgxh` b on a.USER_IDXX = b.USER_IDXX And a.BUSS_CODE = b.BUSS_CODE  WHERE a.USER_IDXX = "' + decoded.id + '" And "' + path + '%" like CONCAT(a.PATH,"%") And a.TYPE_MDUL = "1" ORDER BY a.PATH' ;  // TYPE_MDUL = 1 (API)

                console.log('test', sql);
                
                db.query(sql, (err, rows) => {
                    if (err)
                        throw err;

                    if (rows.length > 0) {
                        var userAccess = rows[0];

                        var authRight = userAccess.RIGH_AUTH;
                        req.AUTH_ADDX = userAccess.AUTH_ADDX;
                        req.AUTH_EDIT = userAccess.AUTH_EDIT;
                        req.AUTH_DELT = userAccess.AUTH_DELT;
                        req.AUTH_PRNT = userAccess.AUTH_PRNT;

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
                        return res.status(403).send({ 
                            status: false, 
                            message: 'Access Denied',
                            userAccess: false
                        });
                    }
                });
            });
        }
}