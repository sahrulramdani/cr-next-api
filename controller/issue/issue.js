import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';

export default class Issue {
    issueAll = (request, response) => {
        var qryCmd = "select ACCT_CODE as id, ACCT_NAMA, STATUS from tb50_rish";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    saveIssue = function(req, res) {
        var sql = 'INSERT INTO tb50_rish SET ?';
        var data = {
            ACCT_CODE : req.body.ACCT_CODE,
            ACCT_NAMA : req.body.ACCT_NAMA,
            STATUS : req.body.STATUS
        };
    
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {
                res.send({
                    status: true
                });
            }
        });
    }

    getIssue = function(req, res) {
        var ids = req.params.id;
        var sql = ' SELECT * FROM `tb50_rish` WHERE ACCT_CODE = "'+ ids +'" ';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    updateIssue = function(req, res) {
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