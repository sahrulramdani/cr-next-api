import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';


export default class Setup {
    pekerjaanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN' order by CODD_DESC";
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

    pendidikanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PENDIDIKAN' order by CODD_VALU";
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

    wilayahKerjaAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb20_area";
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

    typeRelawanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_RELAWAN' order by CODD_VALU";
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

    typeDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_DONATUR' order by CODD_VALU";
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

    typeProgramDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select a.*, " + 
                      "Case a.CODD_VARC " +
                          "WHEN 'PLATINUM' Then 'P' "  +
                          "ELSE b.CODD_VARC " +
                       "End As Level " +
                       "from tb00_basx a left join (select * from tb00_basx where CODD_FLNM = 'TYPE_DONATUR') b on a.CODD_VARC = b.CODD_DESC where a.CODD_FLNM = 'TYPE_PROGRAM_DONATUR' order by a.CODD_VALU";
        
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

    currencyAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'CURR_MNYX' order by CODD_VALU";
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

    donaturProgAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PROGRAM_DONATUR' order by CODD_VALU";
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

    unitAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select *, CASE Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active2 from tb00_unit";
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

    getUnit = function(req, res) {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb00_unit` WHERE KODE_UNIT = "'+ id +'" ';
        db.query(sql, function(err, rows, fields) {
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

    bankAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb02_bank where KODE_FLNM = 'KASX_BANK' And (IsDelete <> '1' Or IsDelete is Null) order by KODE_BANK";
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

    methodPaymentAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb02_bank where KODE_FLNM = 'TYPE_BYRX' And (IsDelete <> '1' Or IsDelete is Null) order by KODE_BANK";
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

    locationAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_lokx";
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

    bussinessUnitAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BUSSINESS_UNIT' order by CODD_VALU";
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

    kelompokKerjaAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KELOMPOK_KERJA' order by CODD_VALU";
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

    statusMaritalAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'MARY_PART' order by CODD_VALU";
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

    channelDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR' order by CODD_VALU";
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

    golDarahAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BLOD_CODE' order by CODD_VALU";
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

    saveSetup = function(req, res) {
        var sql = 'INSERT INTO tb00_basx SET ?';
        var data = {
            CODD_FLNM : req.body.CODD_FLNM,
            CODD_VALU : req.body.CODD_VALU,
            CODD_DESC : req.body.CODD_DESC,
            CODD_VARC : req.body.CODD_VARC ,
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

    updateSetup = function(req, res) {
        var type = req.body.CODD_FLNM;
        var value = req.body.CODD_VALU;
        
        var sql = 'UPDATE tb00_basx SET ? WHERE CODD_VALU = "' + value + '" AND CODD_FLNM = "' + type + '"';
        var data = {
            CODD_DESC : req.body.CODD_DESC,
            CODD_VARC : req.body.CODD_VARC,
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

    deleteSetup = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);

        var category = req.body.CODD_FLNM;
    
        var arrayLength = selectedIds.length;
        var sql = "delete from `tb00_basx` where CODD_FLNM = '" + category + "' And CODD_VALU in (";
        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                  sql += selectedIds[i];
                } else {
                  sql += ',' + selectedIds[i];
                }
            } 
    
            sql += ')';
            
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

    saveUnit = function(req, res) {
        var sql = 'INSERT INTO tb00_unit SET ?';
        var data = {
            KODE_UNIT : req.body.KODE_UNIT,
            NAMA_UNIT : req.body.NAMA_UNIT,
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            KODE_URUT : req.body.KODE_URUT,
            Active : req.body.Active,
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

    updateUnit = function(req, res) {
        var sql = 'UPDATE tb00_unit SET ? WHERE KODE_UNIT = "' + req.body.KODE_UNIT + '"';
        var data = {
            NAMA_UNIT : req.body.NAMA_UNIT,
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            KODE_URUT : req.body.KODE_URUT,
            Active : req.body.Active,
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

    deleteUnit = function(req, res) {
        var id = req.body.KODE_UNIT;
        var sql = "delete from `tb00_unit` where KODE_UNIT = '" + id + "'";
        
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

    saveBank = function(req, res) {
        var sql = 'INSERT INTO tb02_bank SET ?';
        var data = {
            KODE_BANK : req.body.KODE_BANK,
            NAMA_BANK : req.body.NAMA_BANK,
            NOXX_REKX : req.body.NOXX_REKX,
            CURR_MNYX : req.body.CURR_MNYX,
            KODE_FLNM : req.body.KODE_FLNM,
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

    updateBank = function(req, res) {
        var id = req.body.id;
        var sql = 'UPDATE tb02_bank SET ? WHERE KODE_BANK = "' + id + '" And KODE_FLNM = "' + req.body.KODE_FLNM + '"';
        var data = {
            NAMA_BANK : req.body.NAMA_BANK,
            NOXX_REKX : req.body.NOXX_REKX,
            CURR_MNYX : req.body.CURR_MNYX,
            IsDelete : req.body.IsDelete,
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

    deleteBank = function(req, res) {
        var id = req.body.id;
        var sql = "update `tb02_bank` set IsDelete = '1' where KODE_BANK = '" + id + "' And KODE_FLNM = '" + req.body.KODE_FLNM + "'";
        
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

    getBank = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb02_bank` WHERE KODE_BANK = "'+ id +'" And KODE_FLNM = "KASX_BANK"';
        db.query(sql, function(err, rows, fields) {
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

            res.send(output);
        });
    }

    getPaymentMethod = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb02_bank` WHERE KODE_BANK = "'+ id +'" And KODE_FLNM = "TYPE_BYRX"';
        db.query(sql, function(err, rows, fields) {
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

            res.send(output);
        });
    }
}