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
        var typePerson = request.TYPE_PRSON0;
        var typeRelawan = request.TypeRelawan0;

        var qryCmd = "select a.USER_IDXX, a.BUSS_CODE, a.KETX_USER, CASE a.Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active, CASE a.IsValid WHEN '1' THEN 'VALID' ELSE 'NON-VALID' END As IsValid, b.Nama, c.RoleName, Case a.TYPE_PRSON When '1' Then 'RELAWAN' When '2' Then 'DONATUR' When '3' Then 'PENERIMA MANFAAT' Else 'OFISIAL' End As TypePerson, e.CODD_DESC As TypeRelawan FROM tb01_lgxh a LEFT JOIN (select a.Nik, a.Nama, a.TypeRelawan from (select KodeNik As Nik, NamaKry As Nama, TypeRelawan from tb21_empl UNION select No_ID, NAMA, '' As TypeRelawan from tb11_mzjb) a group by a.Nik) b ON a.NO_ID = b.Nik LEFT JOIN role c ON a.TemplateRoleID = c.id LEFT JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT left join tb00_basx e on b.TypeRelawan = e.CODD_VALU And e.CODD_FLNM = 'TYPE_RELAWAN' WHERE (d.KODE_URUT like '" + request.KODE_URUT0 + "%' OR a.BUSS_CODE = '00') And a.Active = '1' order by a.USER_IDXX";

        if (typePerson === '1' && typeRelawan <= '04') {  // 1: Relawan, 04: Korra
            qryCmd = "select a.USER_IDXX, a.BUSS_CODE, a.KETX_USER, CASE a.Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active, CASE a.IsValid WHEN '1' THEN 'VALID' ELSE 'NON-VALID' END As IsValid, b.Nama, c.RoleName, Case a.TYPE_PRSON When '1' Then 'RELAWAN' When '2' Then 'DONATUR' When '3' Then 'PENERIMA MANFAAT' Else 'OFISIAL' End As TypePerson, g.CODD_DESC As TypeRelawan FROM tb01_lgxh a LEFT JOIN (select a.Nik, a.Nama, a.RelawanID, a.TypeRelawan from (select KodeNik As Nik, NamaKry As Nama, KodeNik As RelawanID, TypeRelawan from tb21_empl UNION select No_ID, NAMA, RelawanID, '' As TypeRelawan from tb11_mzjb) a group by a.Nik) b ON a.NO_ID = b.Nik LEFT JOIN role c ON a.TemplateRoleID = c.id LEFT JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT left join vfirst_relawandet e on b.RelawanID = e.RelawanID left join grpx_relx f on e.groupID = f.IDXX_GRPX left join tb00_basx g on b.TypeRelawan = g.CODD_VALU And g.CODD_FLNM = 'TYPE_RELAWAN' WHERE (d.KODE_URUT like '" + request.KODE_URUT0 + "%' OR a.BUSS_CODE = '00') AND a.Active = '1' AND (a.TYPE_PRSON = '1' OR a.TYPE_PRSON = '2') /* 1: Relawan, 2: Donatur */ AND (f.KodeKelurahan like '" + request.KODE_AREA0 + "%' OR e.groupID is null)  order by a.USER_IDXX";
        }

        if (typePerson === '1' && typeRelawan === '05') {  // 1: Relawan, 05: Bendahara group
            qryCmd = "select a.USER_IDXX, a.BUSS_CODE, a.KETX_USER, CASE a.Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active, CASE a.IsValid WHEN '1' THEN 'VALID' ELSE 'NON-VALID' END As IsValid, b.Nama, c.RoleName, Case a.TYPE_PRSON When '1' Then 'RELAWAN' When '2' Then 'DONATUR' When '3' Then 'PENERIMA MANFAAT' Else 'OFISIAL' End As TypePerson, g.CODD_DESC As TypeRelawan FROM tb01_lgxh a LEFT JOIN (select a.Nik, a.Nama, a.TypeRelawan from (select KodeNik As Nik, NamaKry As Nama, TypeRelawan from tb21_empl UNION select No_ID, NAMA, '' As TypeRelawan from tb11_mzjb) a group by a.Nik) b ON a.NO_ID = b.Nik LEFT JOIN role c ON a.TemplateRoleID = c.id LEFT JOIN tb00_unit d ON a.BUSS_CODE = d.KODE_UNIT left join vfirst_relawandet e on b.Nik = e.RelawanID left join grpx_relx f on e.groupID = f.IDXX_GRPX left join tb00_basx g on b.TypeRelawan = g.CODD_VALU And g.CODD_FLNM = 'TYPE_RELAWAN' WHERE (d.KODE_URUT like '" + request.KODE_URUT0 + "%' OR a.BUSS_CODE = '00') And a.Active = '1' And f.IDXX_GRPX = '" + request.groupID + "' order by a.USER_IDXX";
        }

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
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

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
        var sql = 'SELECT a.*, b.Nama, c.KODE_URUT FROM `tb01_lgxh` a LEFT JOIN (select KodeNik As Nik, NamaKry As Nama from tb21_empl UNION select No_ID, NAMA from tb11_mzjb) b ON a.NO_ID = b.Nik LEFT JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT WHERE UPPER(a.USER_IDXX) = "'+ id.toUpperCase() +'" And (c.KODE_URUT like "' + req.KODE_URUT0 + '%" Or a.BUSS_CODE = "00")';
        
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
        var kodeArea = req.KODE_AREA0;
        var groupID = req.groupID;
        var typeRelawan = req.TypeRelawan0;
        
        var sql = 'SELECT a.*, b.NAMA_UNIT, b.KODE_URUT, c.RelawanID As RelawanDonatur, b.DashboardView, f.* FROM `tb01_lgxh` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT left join tb11_mzjb c on a.NO_ID = c.NO_ID left join vfirst_relawandet d on a.NO_ID = d.RelawanID left join grpx_relx e on d.groupID = e.IDXX_GRPX left join tb20_area f on e.KodeKelurahan = f.AREA_IDXX WHERE UPPER(a.USER_IDXX) = "'+ req.userID.toUpperCase() + '"';

        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_EDIT'] = authEdit;
                    obj['KODE_AREA'] = kodeArea;
                    obj['groupID'] = groupID;
                    // obj['TypePerson'] = row['TYPE_PRSON0'];
                    obj['TypeRelawan'] = typeRelawan;

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
        var sql = 'UPDATE `tb01_lgxh` a LEFT JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE UPPER(a.USER_IDXX) = "'+ ids.toUpperCase() +'"  And (b.KODE_URUT like "' + req.KODE_URUT0 + '%" Or a.BUSS_CODE = "00")';

        var hashedPassword;
        var data;
        if (req.body.Password === undefined) {
            data = {
                BUSS_CODE : bussCode,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                'a.Active' : req.body.Active,
                IsValid : req.body.IsValid,
                TYPE_PRSON : typePrson,
                NamaFile : req.body.NamaFile,
                TemplateRoleID : req.body.TemplateRoleID === '' ? null : req.body.TemplateRoleID,
                'a.UPDT_DATE' : new Date(),
                'a.UPDT_BYXX' : req.userID
            };
        } else {
            hashedPassword = bcrypt.hashSync(req.body.Password, 8);
            data = {
                BUSS_CODE : bussCode,
                KETX_USER : req.body.KETX_USER,
                NO_ID : req.body.NO_ID,
                'a.Active' : req.body.Active,
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
                var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                // update data karyawan atau donatur
                if (typePrson === '1' || typePrson === '4') {     // 1: Karyawan
                    sql = 'update tb21_empl a inner join tb01_lgxh b on a.KodeNik = b.NO_ID set a.BUSS_CODE = "' + bussCode + '", UPDT_BYXX = "' + req.userID + '", UPDT_DATE = "' + tgl + '" where UPPER(b.USER_IDXX) = "' + ids.toUpperCase() + '"';
                } else if (typePrson === '2') {  // 2: Donatur
                    sql = 'update tb11_mzjb a inner join tb01_lgxh b on a.NO_ID = b.NO_ID set a.BUSS_CODE = "' + bussCode + '", UPDT_BYXX = "' + req.userID + '", UPDT_DATE = "' + tgl + '" where UPPER(b.USER_IDXX) = "' + ids.toUpperCase() + '"';
                }

                db.query(sql, (err, result) => {
                    if (req.body.IDXX_GRPX !== '' && req.body.NO_ID !== '') {
                        // tambahkan group ke relawan
                        sql = 'insert into tblRelawanDet (RelawanID, IDXX_GRPX, CRTX_BYXX, CRTX_DATE, prime) values ("' + req.body.NO_ID + '", "' + req.body.IDXX_GRPX + '", "' + req.userID + '", "' + tgl + '", "1")';
                        
                        db.query(sql, (err2, result2) => {
                            res.send({
                                status: true
                            });
                        });

                    } else {
                        res.send({
                            status: true
                        });
                    }
                });
            }
        });
    }

    updateUserProfile = function(req, res) {
        var ids = req.userID;
        var sql = 'UPDATE `tb01_lgxh` a SET ? WHERE UPPER(a.USER_IDXX) = "'+ ids.toUpperCase() + '"  ';

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

        var sql = 'SELECT a.*, d.PROC_NAME FROM tb01_usrd a INNER JOIN tb01_lgxh b ON a.USER_IDXX = b.USER_IDXX AND a.BUSS_CODE = b.BUSS_CODE INNER JOIN `tb01_proc` c ON a.PROC_CODE = c.PROC_CODE And a.BUSS_CODE = c.BUSS_CODE INNER JOIN tb00_proc d ON a.PROC_CODE = d.PROC_CODE WHERE UPPER(a.USER_IDXX) = "'+ userID.toUpperCase() +'" ORDER BY d.NoUrut';
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
            AUTH_PRNT : req.body.AUTH_PRNT,
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
            AUTH_PRNT : req.body.AUTH_PRNT,
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

        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var sql = 'INSERT INTO `role_menu` (ROLE_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT, AUTH_APPR, AUTH_PRNT, CRTX_BYXX, CRTX_DATE) SELECT "' + req.body.ROLE_IDXX + '" As ROLE_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, "1" As RIGH_AUTH, "1" As AUTH_ADDX, "1" As AUTH_EDIT, "1" As AUTH_DELT, "1" As AUTH_APPR, "1" As AUTH_PRNT, "' + req.userID + '", "' + tgl + '" from `tb01_proc` where BUSS_CODE = "' + req.body.BUSS_CODE + '" And PROC_CODE <> "AL01"';

        var sqlDelete = 'delete from role_menu where ROLE_IDXX = ' + req.body.ROLE_IDXX;
        
        db.query(sqlDelete, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
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
        });
    }

    // Save User All Detail Privilege
    saveAllDetPrivilege = function(req, res) {
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var sql = 'INSERT INTO `tb01_usrd` (USER_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT, AUTH_APPR, AUTH_PRNT, CRTX_DATE, CRTX_BYXX) SELECT "' + req.body.USER_IDXX + '" As USER_IDXX, PROC_CODE, PATH, BUSS_CODE, MDUL_CODE, TYPE_MDUL, RIGH_AUTH, AUTH_ADDX, AUTH_EDIT, AUTH_DELT, AUTH_APPR, AUTH_PRNT, "' + tgl + '","' + req.userID + '" from `role_menu` where BUSS_CODE = "' + req.body.BUSS_CODE + '" AND PROC_CODE <> "AL01" And ROLE_IDXX = ' + req.body.ROLE_IDXX;

        var sqlDelete = 'delete from tb01_usrd where USER_IDXX = "' + req.body.USER_IDXX + '"';
        
        db.query(sqlDelete, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
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
        });
    }

    getRolePrivilege = function(req, res) {
        var id = req.params.id;
        var sql = 'SELECT * FROM `role_menu` WHERE id = ' + id;
        
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    // update role privilege
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
            AUTH_PRNT : req.body.AUTH_PRNT,
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

            const filters = request.query;
            const filteredUsers = output.filter(item => {
                let isValid = true;
                for (var key in filters) {
                  isValid = isValid && item[key] == filters[key];
                }
                return isValid;
              });

            response.send(filteredUsers);
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
            AUTH_PRNT : req.body.AUTH_PRNT,
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

            var hashedPassword = bcrypt.hashSync(req.body.Password, 8);

            var sql = 'INSERT INTO tb01_lgxh SET ?';
            var data = {
                USER_IDXX : req.body.USER_IDXX,
                PASS_IDXX : hashedPassword,
                KETX_USER : req.body.KETX_USER,
                BUSS_CODE : req.body.BUSS_CODE,
                TYPE_PRSON: req.body.TYPE_PRSON,
                NO_ID : req.body.NO_ID,
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

    getProcessPrivilege = function(req, res) {
        var typeRelawan = req.TypeRelawan0;

        var sql = 'select a.*, c.TYPE_PRSON, d.KODE_URUT from tb01_lgxh c left join (select a.* from tb01_usrd a inner join tb00_proc b on a.PROC_CODE = b.PROC_CODE And b.PATH = "' + req.body.path + '") a on c.USER_IDXX = a.USER_IDXX And c.BUSS_CODE = a.BUSS_CODE inner join tb00_unit d on c.BUSS_CODE = d.KODE_UNIT where UPPER(c.USER_IDXX) = "' + req.userID.toUpperCase() + '"';

        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }
                    
                    obj['TypeRelawan'] = typeRelawan;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }
}