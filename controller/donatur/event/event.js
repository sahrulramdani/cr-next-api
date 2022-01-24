import  db from './../../../koneksi.js';
import { generateAutonumber } from './../../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from './../../../libraries/local/localUtility.js';


export default class Event {
    constructor() {
    }

    saveEvent = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
        }

        var eventID;
        if (req.body.EventID === null || req.body.EventID === undefined) {
            eventID = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            eventID = req.body.EventID;
        }
        
        var sql = 'INSERT INTO tblEvent SET ?';
        var data = {
            EventID : eventID,
            EventName : req.body.EventName,
            Description : req.body.Description,
            Tgl1 : req.body.Tgl1,
            Tgl2 : req.body.Tgl2,
            ProgramID : req.body.ProgramID,
            BUSS_CODE : req.BUSS_CODE0,
            TahunBuku : req.body.TahunBuku,
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
                    status: true, 
                    eventID: eventID
                });
            }
        });
    }

    saveEventDonatur = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
        }

        var sql = 'INSERT INTO tblEvent_donatur SET ?';
        var data = {
            EventID : req.body.EventID,
            DonaturID : req.body.DonaturID,
            AmountCommit : req.body.AmountCommit,
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
                    status: true,
                    eventID: req.body.EventID
                });
            }
        });
    }

    // get Event Detail Donaturs
    getEventDonaturs = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;

        var sql = 'SELECT a.*, b.NAMA, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2 FROM tblEvent_donatur a inner join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT WHERE a.eventID = "'+ id +'" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })

                res.send(output);
            } else {
                res.send([]);
            }
        });
    }

    deleteEventDonatur = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `tblEvent_donatur` where id = " + id;
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

    getEvents = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve
        
        var qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(Tgl1, '%Y-%m-%d') As Tgl1Format, DATE_FORMAT(Tgl2, '%Y-%m-%d') As Tgl2Format, b.NAMA_UNIT, e.NamaKry As NamaRelawan FROM tblEvent a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.ProgramID = c.CODD_VALU And c.CODD_FLNM = 'PROGRAM_DONATUR' And b.KODE_UNIT = c.CODD_VARC inner join tb01_lgxh d on a.CRTX_BYXX = d.USER_IDXX inner join tb21_empl e on d.NO_ID = e.KodeNik where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.IsDelete = '0'";
        
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];
            
            if (err) {
                console.log('Error', err);
            }

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

    getEvent = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var id = request.params.id;   // EventID
        
        var qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(Tgl1, '%Y%m%d') As Tgl1Format, DATE_FORMAT(Tgl2, '%Y%m%d') As Tgl2Format FROM tblEvent a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join (select * from tb00_basx where CODD_FLNM = 'PROGRAM_DONATUR') c on a.ProgramID = c.CODD_VALU And a.BUSS_CODE = c.CODD_VARC where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.EventID = '" + id + "'";
        
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];
            
            if (err) {
                console.log('Error', err);
            }

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

    updateEvent = function(req, res) {
        // check Access PROC_CODE 
        /* if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        } */

        var id = req.body.id;

        var sql = 'UPDATE tblEvent a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.EventID = "' + id + '" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';

        var data = {
            EventName : req.body.EventName,
            Description : req.body.Description,
            Tgl1 : req.body.Tgl1,
            Tgl2 : req.body.Tgl2,
            ProgramID : req.body.ProgramID,
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

    // soft delete
    deleteEvent = function(req, res) {
        var id = req.body.id;
        var sql = "update `tblEvent` set IsDelete = '1' where id = " + id;
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
}