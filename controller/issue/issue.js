import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Issue {
    issueAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.ACCT_CODE as id, a.ACCT_NAMA, b.CODD_DESC, CASE a.STATUS WHEN '1' THEN 'VERIFIKASI' ELSE 'NON-VERIFIKASI' END As STATUS from tb50_rish a left join (select * from tb00_basx where CODD_FLNM='BUSSINESS_UNIT') b on a.CABX_CODE = b.CODD_VALU";
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

    saveIssue = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb50_rish SET ?';
        var data = {
            ACCT_CODE : req.body.ACCT_CODE,
            ACCT_NAMA : req.body.ACCT_NAMA,
            CABX_CODE : req.body.CABX_CODE,
            STATUS : req.body.STATUS,
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

    getIssue = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb50_rish` WHERE ACCT_CODE = "'+ id +'" ';
        
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

    updateIssue = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var ids = req.body.ACCT_CODE;
        var sql = 'UPDATE `tb50_rish` SET ? WHERE ACCT_CODE = "'+ ids +'" ';
        var data = {
            ACCT_CODE : req.body.ACCT_CODE,
            ACCT_NAMA : req.body.ACCT_NAMA,
            CABX_CODE : req.body.CABX_CODE,
            STATUS : req.body.STATUS,
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

    deleteIssue = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
    
        var arrayLength = selectedIds.length;
        var sql = 'delete from `tb50_rish` where ACCT_CODE in (';
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
}