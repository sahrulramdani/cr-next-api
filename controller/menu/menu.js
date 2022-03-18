import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';
import moment from 'moment';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Menu {
    moduleAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var typeModule = request.params.typeModule;
        var bussCode = request.params.bussCode;

        var qryCmd = '';

        if (bussCode === '00' && typeModule === '---') {  // All BUSS_CODE (Entity/Unit), All Type Module
            qryCmd = "select a.* from tb01_modm a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.NoUrut";
        } else {
            if (typeModule === '---') {  // All type Module
                qryCmd = "select * from tb01_modm where BUSS_CODE = '" + bussCode + "' order by NoUrut";
            } else {
                qryCmd = "select * from tb01_modm where BUSS_CODE = '" + bussCode + "' And TYPE_MDUL = '" + typeModule + "' order by NoUrut";
            }
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    module0All = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = 'select * from tb00_modm order by NoUrut';
        
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    processAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var module = request.params.module;
        var bussCode = request.params.bussCode;

        var qryCmd = '';
        if (bussCode === '00') {
            qryCmd = "select a.*, a.PROC_NAME from tb00_proc a where a.MDUL_CODE = '" + module + "' And a.Enabled = '1' order by a.NoUrut";
        } else {
            qryCmd = "select a.*, b.PROC_NAME from tb01_proc a inner join tb00_proc b on a.PROC_CODE = b.PROC_CODE where a.BUSS_CODE = '" + bussCode + "' And a.MDUL_CODE = '" + module + "' order by b.NoUrut";
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    getModule = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT a.* FROM `tb01_modm` a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT WHERE a.id = ' + id + ' And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        
        db.query(sql, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_EDIT'] = authEdit;
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    updateModule = function(req, res) {
        var ids = req.body.id;
        var sql = 'UPDATE `tb01_modm` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.id = ' + ids + ' And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        var data = {
            MDUL_CODE : req.body.MDUL_CODE,
            BUSS_CODE : req.body.BUSS_CODE,
            MDUL_NAMA : req.body.MDUL_NAMA,
            TYPE_MDUL : req.body.TYPE_MDUL,
            'a.UPDT_DATE' : new Date(),
            'a.UPDT_BYXX' : req.userID
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

    saveDetProcess = function(req, res) {
        var sql = 'INSERT INTO tb01_proc SET ?';
        var data = {
            PROC_CODE : req.body.PROC_CODE,
            BUSS_CODE : req.body.BUSS_CODE,
            PATH : req.body.PATH,
            MDUL_CODE : req.body.MDUL_CODE,
            TYPE_MDUL : req.body.TYPE_MDUL,
            PROC_NAME : req.body.PROC_NAME,
            Enabled : req.body.Enabled,
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

    saveDetProcess2 = function(req, res) {
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var sql = 'INSERT INTO tb01_proc (PROC_CODE, BUSS_CODE, PATH, MDUL_CODE, TYPE_MDUL, PROC_NAME, CRTX_DATE, CRTX_BYXX, Enabled) select PROC_CODE, "' + req.body.BUSS_CODE + '","' + req.body.PATH + '", MDUL_CODE, TYPE_MDUL, PROC_NAME, "' + tgl + '","' + req.userID + '","1" from `tb00_proc` where proc_code = "' + req.body.PROC_CODE + '"';
        
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

    deleteDetProcess = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
    
        var arrayLength = selectedIds.length;
        var sql = 'delete a from `tb01_proc` a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.BUSS_CODE = "' + req.body.BUSS_CODE + '" And a.PROC_CODE in ("';
        
        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                  sql += selectedIds[i];
                } else {
                  sql += '","' + selectedIds[i];
                }
            } 
    
            sql += '")';
            
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
           
        } else {
            res.send({
                status: true
            });
        }
    }

    getMenus = function(req, res) {
        var sql = 'SELECT b.*, b.id AS USERACCESS_ID, d.ICON, d.HasChildren, d.PARENT, d.NoUrut, d.PROC_CODE, d.PROC_NAME, d.PATH FROM tb00_proc d LEFT JOIN  (select tb01_proc.*, b.id, b.RIGH_AUTH, b.AUTH_ADDX, b.AUTH_EDIT, b.AUTH_DELT from tb01_proc inner join (select * from `tb01_usrd` where UPPER(USER_IDXX) = "' + req.userID.toUpperCase() + '" And BUSS_CODE = "' + req.BUSS_CODE0 + '") b on tb01_proc.BUSS_CODE = b.BUSS_CODE And tb01_proc.PROC_CODE = b.PROC_CODE) b ON d.PROC_CODE = b.PROC_CODE LEFT JOIN (select * from `tb01_lgxh` where UPPER(USER_IDXX) = "' + req.userID.toUpperCase() + '") c ON b.BUSS_CODE = c.BUSS_CODE WHERE d.NoUrut IS NOT NULL ORDER BY d.NoUrut';

        db.query(sql, function(err, rows, fields) {
            if (err) {
                throw err;
                return;
            }

            var output = [];

            var outputTemp = [];

            // sort NoUrut desc
            rows.sort((a, b) => {
                if (a.NoUrut > b.NoUrut) {
                    return -1;
                } else if (a.NoUrut < b.NoUrut) {
                    return 1;
                };

                return 0;
            });

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    var check = outputTemp.filter(item => item.PARENT === obj.PROC_CODE);
                    if (check.length > 0) {
                        // sort NoUrut Asc
                        check.sort((a, b) => {
                            if (a.NoUrut < b.NoUrut) {
                                return -1;
                            } else if (a.NoUrut > b.NoUrut) {
                                return 1;
                            };
        
                            return 0;
                        });
        
                        obj.children = check;
                    }

                    outputTemp.push(obj);
                })

                output = outputTemp.filter(item => item.PARENT === null);

                // Sort NoUrut Asc
                output.sort((a, b) => {
                    if (a.NoUrut < b.NoUrut) {
                        return -1;
                    } else if (a.NoUrut > b.NoUrut) {
                        return 1;
                    };

                    return 0;
                });
            }

            res.send(output);
        });
    }

    // get Menus tanpa children
    getMenus2 = function(req, res) {
        var sql = 'SELECT a.*, b.id AS USERACCESS_ID, b.RIGH_AUTH, b.AUTH_ADDX, b.AUTH_EDIT, b.AUTH_DELT FROM `tb01_proc` a LEFT JOIN (select * from `tb01_usrd` where UPPER(USER_IDXX) = "' + req.params.userID.toUpperCase() + '") b ON a.BUSS_CODE = b.BUSS_CODE AND a.PROC_CODE = b.PROC_CODE INNER JOIN tb00_proc c ON a.PROC_CODE = c.PROC_CODE WHERE c.NoUrut IS NOT NULL ORDER BY c.NoUrut';
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    saveModule = function(req, res) {
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
        
        var sql = 'INSERT INTO tb01_modm (MDUL_CODE, MDUL_NAMA, TYPE_MDUL, BUSS_CODE, NoUrut, CRTX_BYXX, CRTX_DATE) select MDUL_CODE, MDUL_NAMA, TYPE_MDUL, "' + req.body.BUSS_CODE + '", NoUrut, "' + req.userID + '", "' + tgl + '" from tb00_modm where MDUL_CODE = "' + req.body.MDUL_CODE + '"';
        
        db.query(sql, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                sql = 'select LAST_INSERT_ID() As ID';

                db.query(sql, (err, result2) => {
                    if (err) {
                        console.log('Error', err);
        
                        res.send({
                            status: false,
                            message: err.sqlMessage
                        });
                    } else {
                        res.send(result2);
                    }
                });
            }
        });
    }

    saveDetProcessAll = function(req, res) {
        var mdulCode = req.body.MDUL_CODE;

        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var sql = '';
        var sqlDelete = '';

        if (mdulCode === 'ALL') {
            sql = 'INSERT INTO tb01_modm (MDUL_CODE, MDUL_NAMA, TYPE_MDUL, BUSS_CODE, NoUrut, CRTX_BYXX, CRTX_DATE) select MDUL_CODE, MDUL_NAMA, TYPE_MDUL, "' + req.body.BUSS_CODE + '", NoUrut, "' + req.userID + '", "' + tgl + '" FROM tb00_modm where MDUL_CODE <> "ALL"';
            
            db.query(sql, (err, result) => {
                if (err) {
                    console.log('Error', err);

                    res.send({
                        status: false,
                        message: err.sqlMessage
                    });
                } else {
                    sqlDelete = 'delete from tb01_proc where BUSS_CODE = "' + req.body.BUSS_CODE + '"';

                    sql = 'INSERT INTO tb01_proc (PROC_CODE, BUSS_CODE, PATH, MDUL_CODE, TYPE_MDUL, PROC_NAME, Enabled, CRTX_DATE, CRTX_BYXX) select PROC_CODE, "' + req.body.BUSS_CODE + '", PATH, MDUL_CODE, TYPE_MDUL, PROC_NAME, Enabled, "' + tgl + '", "' + req.userID + '" from tb00_proc';

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
            });
        } else {
            sqlDelete = 'delete from tb01_proc where BUSS_CODE = "' + req.body.BUSS_CODE + '" And MDUL_CODE = "' + mdulCode + '"';

            sql = 'INSERT INTO tb01_proc (PROC_CODE, BUSS_CODE, PATH, MDUL_CODE, TYPE_MDUL, PROC_NAME, Enabled, CRTX_DATE, CRTX_BYXX) select PROC_CODE, "' + req.body.BUSS_CODE + '", PATH, MDUL_CODE, TYPE_MDUL, PROC_NAME, Enabled, "' + tgl + '", "' + req.userID + '" from tb00_proc where MDUL_CODE = "' + mdulCode + '"';
            
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
    }
}