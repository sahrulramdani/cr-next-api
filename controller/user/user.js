import  db from './../../koneksi.js';

export default class User {
    userAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select USER_IDXX, BUSS_CODE, KETX_USER, `Active`, IsValid from tb01_lgxh order by USER_IDXX";
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

    // tidak didelete melainkan hanya set Active menjadi 0
    deleteUser = (request, response) => {
        var id = request.body.id;
        var qryCmd = "update tb01_lgxh set Active='0' where USER_IDXX = '" + id + "'";
        
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
        var sql = 'SELECT * FROM `tb01_lgxh` WHERE USER_IDXX = "'+ id +'" ';
        
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

    getProfile = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        
        var sql = 'SELECT a.*, b.NAMA_UNIT FROM `tb01_lgxh` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT WHERE a.USER_IDXX = "'+ req.userID +'" ';
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

    updateUser = function(req, res) {
        var ids = req.body.USER_IDXX;
        var sql = 'UPDATE `tb01_lgxh` SET ? WHERE USER_IDXX = "'+ ids +'" ';
        var data = {
            BUSS_CODE : req.body.BUSS_CODE,
            KETX_USER : req.body.KETX_USER,
            NO_ID : req.body.NO_ID,
            Active : req.body.Active,
            IsValid : req.body.IsValid,
            TYPE_PRSON : req.body.TYPE_PRSON,
            NamaFile : req.body.NamaFile
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

    // get Detail Privileges User Access (list)
    getDetUserAccesses = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;

        var userID = req.params.userID;

        var sql = 'SELECT a.* FROM tb01_usrd a WHERE a.USER_IDXX = "'+ userID +'" ORDER BY a.PATH';
        db.query(sql, function(err, rows, fields) {
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

            res.send(output);
        });
    }

    deleteDetPrivilege = function(req, res) {
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
        // get user Access
        var authEdit = req.AUTH_EDIT;

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb01_usrd` WHERE id = "'+ id +'" ';
        
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

    saveDetPrivilege = function(req, res) {
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
            AUTH_DELT : req.body.AUTH_DELT
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