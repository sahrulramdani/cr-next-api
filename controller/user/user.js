import  db from './../../koneksi.js';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class User {
    userAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select a.USER_IDXX, a.BUSS_CODE, a.KETX_USER, CASE a.Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active, CASE a.IsValid WHEN '1' THEN 'VALID' ELSE 'NON-VALID' END As IsValid, b.Nama, c.RoleName from tb01_lgxh a LEFT JOIN (select a.Nik, a.Nama from (select KodeNik As Nik, NamaKry As Nama from tb21_empl UNION select No_ID, NAMA from tb11_mzjb) a group by a.Nik) b ON a.NO_ID = b.Nik LEFT JOIN role c ON a.TemplateRoleID = c.id LEFT JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT WHERE d.KODE_URUT like '" + request.KODE_URUT0 + "%' OR a.BUSS_CODE = '00' order by a.USER_IDXX";

        db.query(qryCmd, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_ADDX'] = authAdd;
                    obj['AUTH_EDIT'] = authEdit;
                    obj['AUTH_DELT'] = authDelt;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    // tidak didelete melainkan hanya set Active menjadi 0
    deleteUser = (request, response) => {
        var id = request.body.id;
        var tgl = moment(new Date()).format('YYYY-MM-DD');

        var qryCmd = "update tb01_lgxh set Active='0', UPDT_DATE='" + tgl + "', UPDT_BYXX='" + request.userID + "' where USER_IDXX = '" + id + "'";
        
        db.query(qryCmd, (err, result) => {
            if (err) {
                console.log('Error', err);

                response.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                response.send({
                    status: true
                });
            }
        });
    }

    getUser = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;

        var id = req.params.userID;
        var sql = 'SELECT a.*, b.Nama, c.KODE_URUT FROM `tb01_lgxh` a LEFT JOIN (select KodeNik As Nik, NamaKry As Nama from tb21_empl UNION select No_ID, NAMA from tb11_mzjb) b ON a.NO_ID = b.Nik LEFT JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT WHERE a.USER_IDXX = "'+ id +'" And (c.KODE_URUT like "' + req.KODE_URUT0 + '%" Or a.BUSS_CODE = "00")';
        
        db.query(sql, function(err, rows, fields) {
            var output = []; 

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_EDIT'] = authEdit;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getProfile = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        
        var sql = 'SELECT a.*, b.NAMA_UNIT, b.KODE_URUT FROM `tb01_lgxh` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT WHERE a.USER_IDXX = "'+ req.userID +'" ';
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_EDIT'] = authEdit;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    updateUser = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var typePrson = req.body.TYPE_PRSON;
        var bussCode = req.body.BUSS_CODE;
        var ids = req.body.USER_IDXX;
        var sql = 'UPDATE `tb01_lgxh` a LEFT JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.USER_IDXX = "'+ ids +'"  And (b.KODE_URUT like "' + req.KODE_URUT0 + '%" Or a.BUSS_CODE = "00")';

        var hashedPassword;
        var data;
        if (req.body.password === undefined) {
            data = {
                BUSS_CODE : bussCode,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                'a.Active' : req.body.Active,
                IsValid : req.body.IsValid,
                TYPE_PRSON : typePrson,
                NamaFile : req.body.NamaFile,
                TemplateRoleID : req.body.TemplateRoleID,
                'a.UPDT_DATE' : new Date(),
                'a.UPDT_BYXX' : req.userID
            };
             
        } else {
            hashedPassword = bcrypt.hashSync(req.body.Password, 8);
            data = {
                BUSS_CODE : bussCode,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                Active : req.body.Active,
                IsValid : req.body.IsValid,
                TYPE_PRSON : typePrson,
                NamaFile : req.body.NamaFile,
                TemplateRoleID : req.body.TemplateRoleID,
                PASS_IDXX : hashedPassword,
                'a.UPDT_DATE' : new Date(),
                'a.UPDT_BYXX' : req.userID
            };
        }
        
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {

                // update data karyawan atau donatur
                if (typePrson === '1' || typePrson === '4') {     // 1: Karyawan
                    sql = 'update a set a.BUSS_CODE = "' + bussCode + '" from tb21_empl a inner join tb01_lgxh b on a.KodeNik = b.NO_ID where b.USER_IDXX = "' + ids + '"';
                } else if (typePrson === '2') {  // 2: Donatur
                    sql = 'update a set a.BUSS_CODE = "' + bussCode + '" from tb11_mzjb a inner join tb01_lgxh b on a.NO_ID = b.NO_ID where b.USER_IDXX = "' + ids + '"';
                }

                db.query(sql, (err, result) => {
                    res.send({
                        status: true
                    });
                });
            }
        });
    }

    updateUserProfile = function(req, res) {
        var ids = req.userID;
        var sql = 'UPDATE `tb01_lgxh` a SET ? WHERE a.USER_IDXX = "'+ ids + '"  ';

        var hashedPassword;
        var data;
        if (req.body.password === undefined) {
            data = {
                BUSS_CODE : req.body.BUSS_CODE,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                'a.Active' : req.body.Active,
                IsValid : req.body.IsValid,
                TYPE_PRSON : req.body.TYPE_PRSON,
                NamaFile : req.body.NamaFile,
                TemplateRoleID : req.body.TemplateRoleID,
                'a.UPDT_DATE' : new Date(),
                'a.UPDT_BYXX' : req.userID
            };
             
        } else {
            hashedPassword = bcrypt.hashSync(req.body.Password, 8);
            data = {
                BUSS_CODE : req.body.BUSS_CODE,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                Active : req.body.Active,
                IsValid : req.body.IsValid,
                TYPE_PRSON : req.body.TYPE_PRSON,
                NamaFile : req.body.NamaFile,
                TemplateRoleID : req.body.TemplateRoleID,
                PASS_IDXX : hashedPassword,
                'a.UPDT_DATE' : new Date(),
                'a.UPDT_BYXX' : req.userID
            };
        }
        
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

    // get Detail Privileges User Access (list)
    getDetUserAccesses = function(req, res) {
        var userID = req.params.userID;

        var sql = 'SELECT a.*, d.PROC_NAME FROM tb01_usrd a INNER JOIN tb01_lgxh b ON a.USER_IDXX = b.USER_IDXX AND a.BUSS_CODE = b.BUSS_CODE INNER JOIN `tb01_proc` c ON a.PROC_CODE = c.PROC_CODE And a.BUSS_CODE = c.BUSS_CODE INNER JOIN tb00_proc d ON a.PROC_CODE = d.PROC_CODE WHERE a.USER_IDXX = "'+ userID +'" ORDER BY d.NoUrut';
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    deleteDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var id = req.body.id;
        var sql = "delete from `tb01_usrd` where id = " + id;
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

    // get Detail Privilege User Access
    getDetUserAccess = function(req, res) {
        var id = req.params.id;
        var sql = 'SELECT * FROM `tb01_usrd` WHERE id = "'+ id +'" ';
        
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    saveDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb01_usrd SET ?';
        var data = {
            USER_IDXX : req.body.USER_IDXX ,
            PROC_CODE : req.body.PROC_CODE,
            PATH : req.body.PATH,
            BUSS_CODE : req.body.BUSS_CODE,
            MDUL_CODE : req.body.MDUL_CODE,
            TYPE_MDUL : req.body.TYPE_MDUL,
            RIGH_AUTH : req.body.RIGH_AUTH,
            AUTH_ADDX : req.body.AUTH_ADDX,
            AUTH_EDIT : req.body.AUTH_EDIT,
            AUTH_DELT : req.body.AUTH_DELT,
            AUTH_APPR : req.body.AUTH_APPR,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
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

    saveRole = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO `role` SET ?';
        var data = {
            RoleName : req.body.RoleName,
            UnitID : req.body.UnitID,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };
        
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                sql = 'select LAST_INSERT_ID() As ID;';

                db.query(sql, data, (err, result2) => {
                    res.send(result2);
                });
            }
        });
    }

    saveRoleDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO `role_menu` SET ?';
        var data = {
            ROLE_IDXX : req.body.ROLE_IDXX ,
            PROC_CODE : req.body.PROC_CODE,
            PATH : req.body.PATH,
            BUSS_CODE : req.body.BUSS_CODE,
            TYPE_MDUL : req.body.TYPE_MDUL,
            MDUL_CODE : req.body.MDUL_CODE,
            TYPE_MDUL : req.body.TYPE_MDUL,
            RIGH_AUTH : req.body.RIGH_AUTH,
            AUTH_ADDX : req.body.AUTH_ADDX,
            AUTH_EDIT : req.body.AUTH_EDIT,
            AUTH_DELT : req.body.AUTH_DELT,
            AUTH_APPR : req.body.AUTH_APPR,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
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

    deleteRoleDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var id = req.body.id;
        var sql = "delete from `role_menu` where id = " + id;
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

    // get Role Detail Privileges User Access (list)
    getRoleDetUserAccesses = function(req, res) {
        var roleID = req.params.roleID;

        var sql = 'SELECT a.*, d.PROC_NAME FROM role_menu a INNER JOIN role b ON a.ROLE_IDXX = b.id AND a.BUSS_CODE = b.UnitID INNER JOIN tb01_proc c ON a.PROC_CODE = c.PROC_CODE And a.BUSS_CODE = c.BUSS_CODE INNER JOIN tb00_proc d ON c.PROC_CODE = d.PROC_CODE WHERE a.ROLE_IDXX = ' + roleID + ' ORDER BY d.NoUrut';
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    saveRoleAllDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO `role_menu` (ROLE_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT) SELECT "' + req.body.ROLE_IDXX + '" As ROLE_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, "1" As RIGH_AUTH, "1" As AUTH_ADDX, "1" As AUTH_EDIT, "1" As AUTH_DELT from `tb01_proc` where BUSS_CODE = "' + req.body.BUSS_CODE + '"';
        
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

    // Save User All Detail Privilege
    saveAllDetPrivilege = function(req, res) {
        var tgl = moment(new Date()).format('YYYY-MM-DD');

        var sql = 'INSERT INTO `tb01_usrd` (USER_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT, CRTX_DATE, CRTX_BYXX) SELECT "' + req.body.USER_IDXX + '" As USER_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT, "' + tgl + '","' + req.userID + '" from `role_menu` where BUSS_CODE = "' + req.body.BUSS_CODE + '" AND ROLE_IDXX = ' + req.body.ROLE_IDXX;
        
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

    getRolePrivilege = function(req, res) {
        var id = req.params.id;
        var sql = 'SELECT * FROM `role_menu` WHERE id = ' + id;
        
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    updateDetPrivilege = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var ids = req.body.id;
        var sql = 'UPDATE `role_menu` SET ? WHERE id = '+ ids;
        var data = {
            RIGH_AUTH : req.body.RIGH_AUTH,
            AUTH_ADDX : req.body.AUTH_ADDX,
            AUTH_EDIT : req.body.AUTH_EDIT,
            AUTH_DELT : req.body.AUTH_DELT,
            AUTH_APPR : req.body.AUTH_APPR,
            UPDT_DATE : new Date(),
            UPDT_BYXX : req.userID
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

    roleAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select a.* from `role` a inner join tb00_unit b on a.UnitID = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.RoleName";
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_ADDX'] = authAdd;
                    obj['AUTH_EDIT'] = authEdit;
                    obj['AUTH_DELT'] = authDelt;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    updateUserDetPrivilege = function(req, res) {
        var ids = req.body.id;
        var sql = 'UPDATE `tb01_usrd` SET ? WHERE id = '+ ids;
        var data = {
            RIGH_AUTH : req.body.RIGH_AUTH,
            AUTH_ADDX : req.body.AUTH_ADDX,
            AUTH_EDIT : req.body.AUTH_EDIT,
            AUTH_DELT : req.body.AUTH_DELT,
            AUTH_APPR : req.body.AUTH_APPR,
            UPDT_DATE : new Date(),
            UPDT_BYXX : req.userID
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

    getRole = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;

        var id = req.params.id;
        var sql = 'select a.* from `role` a inner join tb00_unit b on a.UnitID = b.KODE_UNIT where a.id = '+ id + ' And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_EDIT'] = authEdit;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    updateRole = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var ids = req.body.id;
        var sql = 'UPDATE `role` SET ? WHERE id = '+ ids;
        var data = {
            RoleName : req.body.RoleName,
            UnitID : req.body.UnitID,
            UPDT_DATE : new Date(),
            UPDT_BYXX : req.userID
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

    saveUser = function(req, res) {
            // check Access PROC_CODE 
            if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
                res.status(403).send({ 
                    status: false, 
                    message: 'Access Denied',
                    userAccess: false
                });

                return;
            }

            var hashedPassword = bcrypt.hashSync(req.body.password, 8);

            var sql = 'INSERT INTO tb01_lgxh SET ?';
            var data = {
                USER_IDXX : req.body.USER_IDXX,
                PASS_IDXX : hashedPassword,
                KETX_USER : req.body.KETX_USER,
                BUSS_CODE : req.body.BUSS_CODE,
                Active : req.body.Active,
                IsValid : req.body.IsValid,
                Email : req.body.Email,
                TemplateRoleID : req.body.TemplateRoleID,
                CRTX_DATE : new Date(),
                CRTX_BYXX : req.userID
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
}