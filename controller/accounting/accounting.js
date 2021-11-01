import  db from './../../koneksi.js';
import moment from 'moment';


export default class Accounting {
        tahunBukuAll = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;

            var qryCmd = "select * from tb00_thna order by TGLX_STRT desc";
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

        saveTahunBuku = function(req, res) {
            var sql = 'INSERT INTO tb00_thna SET ?';
            var data = {
                THNX_AJAR : req.body.THNX_AJAR,
                CABX_CODE : req.body.CABX_CODE,
                KETX_THN : req.body.KETX_THN,
                TGLX_STRT : req.body.TGLX_STRT,
                TGLX_ENDX : req.body.TGLX_ENDX,
                STAT_AKTF : req.body.STAT_AKTF,
                CRTX_DATE : new Date(),
                CRTX_BYXX : req.userID
            };
    
            // set seluruh data Non Aktif
            var sql2 = 'UPDATE tb00_thna SET STAT_AKTF = "0"';
            
            db.query(sql2, (err2, result2) => {
                db.query(sql, data, (err2, result2) => {
                    if (err2) {
                        console.log('Error', err2);
        
                        res.send({
                            status: false,
                            message: err2.sqlMessage
                        });
                    } else {
                        res.send({
                            status: true
                        });
                    }
                });
            });
        }

        mutasiAll = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;

            var qryCmd = "select *, DATE_FORMAT(TransDate, '%d/%m/%Y %H:%i') As TransDateFormat, DATE_FORMAT(ValutaDate, '%d/%m/%Y %H:%i') As ValutaDateFormat from tblMutasi order by TransDate desc";
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

        mutasiFilterDate = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;

            var tgl1 = request.params.tgl1;
            var tgl2 = request.params.tgl2;

            var qryCmd = "select *, DATE_FORMAT(TransDate, '%d/%m/%Y %H:%i') As TransDateFormat, DATE_FORMAT(ValutaDate, '%d/%m/%Y %H:%i') As ValutaDateFormat from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') between '" + tgl1 + "' And '" + tgl2 + "' order by TransDate desc";
            
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

        mutasiFilter = (request, response) => {
            var tgl = request.params.tgl;
            var field = request.params.field;
            var value = request.params.value;
            var qryCmd = '';

            if (field !== undefined) {
                if (field === 'NoReference') {
                    qryCmd = "select * from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') = '" + tgl + "' And NoReference = '" + value + "'";
                } else if (field === 'Description') {
                    qryCmd = "select * from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') = '" + tgl + "' And Keterangan like '%" + value + "%'";
                } else if (field === 'Amount') {
                    qryCmd = "select * from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') = '" + tgl + "' And Amount = " + value;
                } 
                
            } else {
                qryCmd = "select * from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') = '" + tgl + "'";
            }

            db.query(qryCmd, function(err, rows, fields) {
                var output = [];

                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    output.push(obj);
                })

                response.send(output);
            });
        }

        saveMutasi = function(req, res) {
            var rows = req.body.rows;
            var bank = req.body.bank;
            var tgl = moment(new Date()).format('YYYY-MM-DD');

            var sql = 'INSERT INTO tblMutasi (TransDate, ValutaDate, NoReference, Keterangan, DK, Amount, Saldo, Bank, CRTX_DATE, CRTX_BYXX) VALUES (';
            if (rows.length > 1) {
                rows.forEach((item, index) => {
                        if (index > 0) {
                            if (index === 1) {
                                sql = sql + '"' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + item[4] + '",' + item[5] + ',' + item[6] + ',"' + bank + '","' + tgl + '","' + req.userID + '")';
                            } else {
                                sql = sql + ',("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + item[4] + '",' + item[5] + ',' + item[6] + ',"' + bank + '","' + tgl + '","' + req.userID + '")';
                            }
                        }
                });

                console.log(sql);

                db.query(sql, (err2, result2) => {
                    if (err2) {
                        console.log('Error', err2);
        
                        res.send({
                            status: false,
                            message: err2.sqlMessage
                        });
                    } else {
                        res.send({
                            status: true
                        });
                    }
                });
            } else {
                res.send({
                    status: true,
                    message: 'Data empty'
                });
            }
        }

        getMutasi = function(req, res) {
            // get user Access
            var authEdit = req.AUTH_EDIT;
    
            var id = req.params.id;
            var sql = 'SELECT * FROM `tblMutasi` WHERE id = '+ id;
            
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

        updateMutasi = function(req, res) {
            var id = req.body.id;
            var sql = 'UPDATE `tblMutasi` SET ? WHERE id = '+ id;
            var data = {
                TransNumber : req.body.TransNumber,
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
}