import  db from './../../koneksi.js';
import moment from 'moment';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Accounting {
        tahunBukuAll = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;
            var authAppr = request.AUTH_APPR;  // auth Approve

            var qryCmd = "select * from tb00_thna order by TGLX_STRT desc";
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

                    response.send(output);
                } else {
                    response.send([]);
                }
            });
            
        }

        saveTahunBuku = function(req, res) {
            // check Access PROC_CODE 
            if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
                res.status(403).send({ 
                    status: false, 
                    message: 'Access Denied',
                    userAccess: false
                });

                return;
            }

            var sql = 'INSERT INTO tb00_thna SET ?';
            var data = {
                THNX_AJAR : req.body.THNX_AJAR,
                CABX_CODE : req.body.CABX_CODE,
                KETX_THN : req.body.KETX_THN,
                TGLX_STRT : req.body.TGLX_STRT,
                TGLX_ENDX : req.body.TGLX_ENDX,
                TGLX_STRT2 : req.body.TGLX_STRT2,
                TGLX_ENDX2 : req.body.TGLX_ENDX2,
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
            var authAppr = request.AUTH_APPR;  // auth Approve
            const filters = request.query;

            var bankID = request.params.bankID;
            var limit = request.params.limit;
            var offset = request.params.offset;

            var qryCmd = "select a.*, DATE_FORMAT(a.TransDate, '%d/%m/%Y %H:%i:%s') As TransDateFormat, DATE_FORMAT(a.ValutaDate, '%d/%m/%Y %H:%i:%s') As ValutaDateFormat from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Bank = '" + bankID + "' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.NoReference like '%" + filters.NoReference + "%' And  a.Keterangan like '%" + filters.Keterangan + "%' order by a.TransDate desc LIMIT " + limit + " OFFSET " + offset;
            
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

                    response.send(output);
                } else {
                    response.send([]);
                }
            });
        }

        mutasiFilterDate = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;
            var authAppr = request.AUTH_APPR;  // auth Approve

            var tgl1 = request.params.tgl1;
            var tgl2 = request.params.tgl2;

            var qryCmd = "select *, DATE_FORMAT(TransDate, '%d/%m/%Y %H:%i') As TransDateFormat, DATE_FORMAT(ValutaDate, '%d/%m/%Y %H:%i') As ValutaDateFormat from tblMutasi where DATE_FORMAT(TransDate, '%Y-%m-%d') between '" + tgl1 + "' And '" + tgl2 + "' order by TransDate desc";
            
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

                    response.send(output);
                } else {
                    response.send([]);
                }
            });
        }

        mutasiFilter = (request, response) => {
            var tgl = request.params.tgl;
            var field = request.params.field;
            var value = request.params.value;
            var qryCmd = '';

            if (field !== undefined && field !== '') {
                if (field === 'NoReference') {
                    qryCmd = "select a.*, DATE_FORMAT(a.TransDate, '%d/%m/%Y %H:%i:%s') As TglFormat, c.CODD_DESC As NamaBank from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.KODE_STDX_BANK = c.CODD_VARC And c.CODD_FLNM = 'BANK' where DATE_FORMAT(a.TransDate, '%Y-%m-%d') = '" + tgl + "' And a.NoReference = '" + value + "' And a.TransNumber is Null And b.KODE_URUT like '" + request.KODE_URUT0 + "%'";
                } else if (field === 'Description') {
                    qryCmd = "select a.*, DATE_FORMAT(a.TransDate, '%d/%m/%Y %H:%i:%s') As TglFormat, c.CODD-DESC As NamaBank from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.KODE_STDX_BANK = c.CODD_VARC And c.CODD_FLNM = 'BANK' where DATE_FORMAT(a.TransDate, '%Y-%m-%d') = '" + tgl + "' And a.Keterangan like '%" + value + "%' And a.TransNumber is Null And b.KODE_URUT like '" + request.KODE_URUT0 + "%'";
                } else if (field === 'Amount') {
                    qryCmd = "select a.*, DATE_FORMAT(a.TransDate, '%d/%m/%Y %H:%i:%s') As TglFormat, c.CODD_DESC As NamaBank from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.KODE_STDX_BANK = c.CODD_VARC And c.CODD_FLNM = 'BANK' where DATE_FORMAT(a.TransDate, '%Y-%m-%d') = '" + tgl + "' And a.Amount = " + value + " And a.TransNumber is Null And b.KODE_URUT like '" + request.KODE_URUT0 + "%'";
                } 
            } else {
                qryCmd = "select a.*, DATE_FORMAT(a.TransDate, '%d/%m/%Y %H:%i:%s') As TglFormat, c.CODD_DESC As NamaBank from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.KODE_STDX_BANK = c.CODD_VARC And c.CODD_FLNM = 'BANK' where DATE_FORMAT(a.TransDate, '%Y-%m-%d') = '" + tgl + "' And a.TransNumber is Null And b.KODE_URUT like '" + request.KODE_URUT0 + "%'";
            }

            db.query(qryCmd, function(err, rows, fields) {
                var output = [];

                if (rows.length > 0) {
                    rows.forEach(function(row) {
                        var obj = new Object();
                        for(var key in row) {
                            obj[key] = row[key];
                        }

                        output.push(obj);
                    })

                    response.send(output);
                } else {
                    response.send([]);
                }
            });
        }

        saveMutasi = function(req, res) {
            // check Access PROC_CODE 
            if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
                res.status(403).send({ 
                    status: false, 
                    message: 'Access Denied',
                    userAccess: false
                });

                return;
            }
            
            var rows = req.body.rows;
            var bank = req.body.bank;
            var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            var bussCode = req.BUSS_CODE0;

            var sql = 'INSERT INTO tblMutasi (TransDate, ValutaDate, NoReference, Keterangan, DK, Amount, Saldo, Bank, CRTX_DATE, CRTX_BYXX, BUSS_CODE) VALUES (';
            if (rows.length > 1) {
                rows.forEach((item, index) => {
                        if (index > 0) {
                            if (index === 1) {
                                sql = sql + '"' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + item[4] + '",' + item[5] + ',' + item[6] + ',"' + bank + '","' + tgl + '","' + req.userID + '","' + bussCode + '")';
                            } else {
                                sql = sql + ',("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + item[4] + '",' + item[5] + ',' + item[6] + ',"' + bank + '","' + tgl + '","' + req.userID + '","' + bussCode + '")';
                            }
                        }
                });

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
            var authAppr = req.AUTH_APPR;  // auth Approve
    
            var id = req.params.id;
            var sql = 'SELECT a.* FROM `tblMutasi` a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT WHERE a.id = ' + id + ' And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
            
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
        
                    res.send(output);
                } else {
                    res.send([]);
                }
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

        getActiveTahunBuku = function(req, res) {
            var tgl = moment(new Date()).format('YYYYMMDD');
            var sql = 'SELECT * FROM `tb00_thna` WHERE ("' + tgl + '" Between DATE_FORMAT(TGLX_STRT, "%Y%m%d") And DATE_FORMAT(TGLX_ENDX, "%Y%m%d") And CABX_CODE = "' + req.BUSS_CODE0 + '") Or STAT_AKTF = "1"';
            
            db.query(sql, function(err, rows, fields) {
                res.send(rows);
            });
        }

        getActiveTahunDonasi = function(req, res) {
            var tgl = moment(new Date()).format('YYYYMMDD');
            var sql = 'SELECT a.*, b.DashboardView FROM `tb00_thna` a left join tb00_unit b on a.CABX_CODE = b.KODE_UNIT WHERE ("' + tgl + '" Between DATE_FORMAT(a.TGLX_STRT2, "%Y%m%d") And DATE_FORMAT(a.TGLX_ENDX2, "%Y%m%d") And a.CABX_CODE = "' + req.BUSS_CODE0 + '") Or STAT_AKTF = "1"';
            
            db.query(sql, function(err, rows, fields) {
                var output = [];

                if (rows.length > 0) {
                    rows.forEach(function(row) {
                        var obj = new Object();
                        for(var key in row) {
                            obj[key] = row[key];
                        }

                        obj['TypePerson'] = req.TYPE_PRSON0;
                        obj['TypeRelawan'] = req.TypeRelawan0;
                        obj['KODE_AREA'] = req.KODE_AREA0;

                        output.push(obj);
                    })
                }

                res.send(output);
            });
        }

        summaryBank = (request, response) => {
            var tgl1 = request.params.tgl1;
            var tgl2 = request.params.tgl2;

            var qryCmd = "select b.BUSS_CODE, b.CURR_MNYX, b.CHKX_BANK, SUM(IFNULL(c.TotalDebit,0)) As TotalDebit, SUM(IFNULL(c.TotalKredit,0)) As TotalKredit, SUM(a.VALU_SLDO) As TotalSaldo FROM tb02_bnkh a inner join tb02_bank b on a.KODE_BANK = b.KODE_BANK left join (select Bank, SUM(Case DK When 'D' Then Amount Else 0 End) As TotalDebit, SUM(Case DK When 'K' Then Amount Else 0 End) As TotalKredit from tblMutasi where DATE_FORMAT(TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +  "' group by Bank) c on b.KODE_BANK = c.Bank inner join tb00_unit d on b.BUSS_CODE = d.KODE_UNIT where d.KODE_URUT like '" + request.KODE_URUT0 + "%' group by b.BUSS_CODE, b.CURR_MNYX, b.CHKX_BANK";

            db.query(qryCmd, function(err, rows, fields) {
                response.send(rows);
            });
        }

        getSaldoBank = (request, response) => {
            var qryCmd = "select a.*, DATE_FORMAT(a.UPDT_DATE, '%e-%b-%Y') As TglFormat, b.NAMA_BANK from tb02_bnkh a inner join tb02_bank b on a.KODE_BANK = b.KODE_BANK inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT where c.KODE_URUT like '" + request.KODE_URUT0 + "%' And AccountID is not null";

            db.query(qryCmd, function(err, rows, fields) {
                response.send(rows);
            });
        }

        getCountMutasi = (request, response) => {
            var bankID = request.params.bankID;
            const filters = request.query;

            var qryCmd = "select COUNT(*) As TotalData from tblMutasi a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Bank = '" + bankID + "' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.NoReference like '%" + filters.NoReference + "%' And a.Keterangan like '%" + filters.Keterangan + "%'";

            db.query(qryCmd, function(err, rows, fields) {
                response.send(rows);
            });
        }
}