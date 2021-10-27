import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';

export default class Menu {
    moduleAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var typeModule = request.params.typeModule;
        var bussCode = request.params.bussCode;

        var qryCmd = '';

        if (bussCode === '00' && typeModule === '---') {  // All BUSS_CODE (Entity/Unit), All Type Module
            qryCmd = "select * from tb01_modm order by NoUrut";
        } else {
            if (typeModule === '---') {  // All type Module
                qryCmd = "select * from tb01_modm where BUSS_CODE = '" + bussCode + "' order by NoUrut";
            } else {
                qryCmd = "select * from tb01_modm where BUSS_CODE = '" + bussCode + "' And TYPE_MDUL = '" + typeModule + "' order by NoUrut";
            }
        }
        
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];

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

            response.send(output);
        });
    }

    processAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var module = request.params.module;
        var bussCode = request.params.bussCode;

        var qryCmd = "select * from tb01_proc where BUSS_CODE = '" + bussCode + "' And MDUL_CODE = '" + module + "'";
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];
            
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

            response.send(output);
        });
    }

    getModule = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb01_modm` WHERE MDUL_CODE = "'+ id +'" ';
        
        db.query(sql, function(err, rows, fields) {
            var output = [];

            rows.forEach(function(row) {
                var obj = new Object();
                for(var key in row) {
                    obj[key] = row[key];
                }

                obj['AUTH_EDIT'] = authEdit;

                output.push(obj);
            })

            res.send(output);
        });
    }

    updateModule = function(req, res) {
        var ids = req.body.MDUL_CODE;
        var sql = 'UPDATE `tb01_modm` SET ? WHERE MDUL_CODE = "'+ ids +'" ';
        var data = {
            BUSS_CODE : req.body.BUSS_CODE,
            MDUL_NAMA : req.body.MDUL_NAMA,
            TYPE_MDUL : req.body.TYPE_MDUL,
            NoUrut : req.body.NoUrut,
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

    saveDetProcess = function(req, res) {
        var sql = 'INSERT INTO tb01_proc SET ?';
        var data = {
            PROC_CODE : req.body.PROC_CODE,
            BUSS_CODE : req.body.BUSS_CODE,
            PATH : req.body.PATH,
            MDUL_CODE : req.body.MDUL_CODE,
            TYPE_MDUL : req.body.TYPE_MDUL,
            PROC_NAME : req.body.PROC_NAME,
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

    deleteDetProcess = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
    
        var arrayLength = selectedIds.length;
        var sql = 'delete from `tb01_proc` where PROC_CODE in ("';
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
        var sql = 'SELECT a.*, b.id AS USERACCESS_ID, b.RIGH_AUTH, b.AUTH_ADDX, b.AUTH_EDIT, b.AUTH_DELT FROM `tb01_proc` a LEFT JOIN (select * from `tb01_usrd` where USER_IDXX = "' + req.userID + '") b ON a.BUSS_CODE = b.BUSS_CODE AND a.PROC_CODE = b.PROC_CODE WHERE a.NoUrut IS NOT NULL ORDER BY a.NoUrut';
        db.query(sql, function(err, rows, fields) {
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

            res.send(output);
        });
    }

    // get Menus tanpa children
    getMenus2 = function(req, res) {
        var sql = 'SELECT a.*, b.id AS USERACCESS_ID, b.RIGH_AUTH, b.AUTH_ADDX, b.AUTH_EDIT, b.AUTH_DELT FROM `tb01_proc` a LEFT JOIN (select * from `tb01_usrd` where USER_IDXX = "' + req.params.userID + '") b ON a.BUSS_CODE = b.BUSS_CODE AND a.PROC_CODE = b.PROC_CODE WHERE a.NoUrut IS NOT NULL  ORDER BY a.NoUrut';
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }
}