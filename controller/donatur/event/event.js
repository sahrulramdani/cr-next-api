import  db from './../../../koneksi.js';
import { 
    generateAutonumber, fncAnd
} from './../../../libraries/sisqu/Utility.js';
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

        var bussCode = req.body.BUSS_CODE;
        if (bussCode === '' || bussCode === undefined) {
            bussCode - req.BUSS_CODE0;
        }
        
        var sql = 'INSERT INTO tblEvent SET ?';
        var data = {
            EventID : eventID,
            EventName : req.body.EventName,
            Description : req.body.Description,
            Tgl1 : req.body.Tgl1,
            Tgl2 : req.body.Tgl2,
            ProgramID : req.body.ProgramID,
            BUSS_CODE : bussCode,
            IDXX_GRPX : req.body.IDXX_GRPX,
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

        var qryCmd = '';
        
        if (request.TYPE_PRSON0 === '1') { // 1: Relawan
            qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(a.Tgl1, '%Y-%m-%d') As Tgl1Format, DATE_FORMAT(a.Tgl2, '%Y-%m-%d') As Tgl2Format, b.NAMA_UNIT, e.NamaKry As NamaRelawan, g.NAMA_GRPX FROM tblEvent a left join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.ProgramID = c.CODD_VALU And c.CODD_FLNM = 'PROGRAM_DONATUR' And b.KODE_UNIT = c.CODD_VARC left join tb01_lgxh d on a.CRTX_BYXX = d.USER_IDXX left join tb21_empl e on d.NO_ID = e.KodeNik left join grpx_relx g on a.IDXX_GRPX = g.IDXX_GRPX left join (select b.IDXX_GRPX from grpx_relx b inner join (select b.RelawanID, c.KODE_URUT, c.IDXX_GRPX from tblrelawandet b inner join grpx_relx c on b.IDXX_GRPX = c.IDXX_GRPX inner join tb01_lgxh d on b.RelawanID = d.NO_ID where c.NAMA_GRPX is not null And UPPER(d.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by c.KODE_URUT) c on b.KODE_URUT like CONCAT(c.KODE_URUT, '%') group by b.IDXX_GRPX) priv on a.IDXX_GRPX = priv.IDXX_GRPX WHERE b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.IsDelete = '0' And (priv.IDXX_GRPX Is Not Null Or g.KODE_URUT Is Null)";
        } else if (request.TYPE_PRSON0 === '2') {   //  2: Donatur
            qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(a.Tgl1, '%Y-%m-%d') As Tgl1Format, DATE_FORMAT(a.Tgl2, '%Y-%m-%d') As Tgl2Format, b.NAMA_UNIT, e.NamaKry As NamaRelawan, g.NAMA_GRPX FROM tblEvent a left join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.ProgramID = c.CODD_VALU And c.CODD_FLNM = 'PROGRAM_DONATUR' And b.KODE_UNIT = c.CODD_VARC left join tb01_lgxh d on a.CRTX_BYXX = d.USER_IDXX left join tb21_empl e on d.NO_ID = e.KodeNik left join grpx_relx g on a.IDXX_GRPX = g.IDXX_GRPX left join (select b.IDXX_GRPX from grpx_relx b inner join (select b.NO_ID, c.KODE_URUT, c.IDXX_GRPX from tb11_mzjb b inner join grpx_relx c on b.IDXX_GRPX = c.IDXX_GRPX inner join tb01_lgxh d on b.NO_ID = d.NO_ID where c.NAMA_GRPX is not null And UPPER(d.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by c.KODE_URUT) c on b.KODE_URUT like CONCAT(c.KODE_URUT, '%') group by b.IDXX_GRPX) priv on a.IDXX_GRPX = priv.IDXX_GRPX WHERE b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.IsDelete = '0' And (priv.IDXX_GRPX Is Not Null Or g.KODE_URUT Is Null)";
        } else {
            qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(a.Tgl1, '%Y-%m-%d') As Tgl1Format, DATE_FORMAT(a.Tgl2, '%Y-%m-%d') As Tgl2Format, b.NAMA_UNIT, e.NamaKry As NamaRelawan, g.NAMA_GRPX FROM tblEvent a left join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.ProgramID = c.CODD_VALU And c.CODD_FLNM = 'PROGRAM_DONATUR' And b.KODE_UNIT = c.CODD_VARC left join tb01_lgxh d on a.CRTX_BYXX = d.USER_IDXX left join tb21_empl e on d.NO_ID = e.KodeNik left join grpx_relx g on a.IDXX_GRPX = g.IDXX_GRPX WHERE b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.IsDelete = '0'";
        }
        
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

                const filters = request.query;
                const filteredUsers = output.filter(item => {
                    let isValid = true;
                    for (var key in filters) {
                        isValid = isValid && item[key] == filters[key];
                    }
                    return isValid;
                });

                response.send(filteredUsers);
            } else {
                response.send([]);
            }
        });
    }

    // get Events yang dihadiri Donatur
    getEventsDonatur = (request, response) => {
        // get user Access
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        
        var donaturID = request.params.donaturID;

        var sql = 'select f.NAMA, b.*, DATE_FORMAT(b.Tgl1, "%Y-%m-%d") As Tgl1Format, DATE_FORMAT(b.Tgl2, "%Y-%m-%d") As Tgl2Format, c.NAMA_UNIT, d.NAMA_GRPX, e.CODD_DESC As ProgDonatur FROM tblEvent_donatur a inner join tblEvent b on a.EventID = b.EventID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join grpx_relx d on b.IDXX_GRPX = d.IDXX_GRPX left join tb00_basx e on b.ProgramID = e.CODD_VALU And b.BUSS_CODE = e.CODD_VARC And e.CODD_FLNM = "PROGRAM_DONATUR" left join tb11_mzjb f on a.DonaturID = f.NO_ID where a.DonaturID = "' + donaturID + '" And c.KODE_URUT like "' + request.KODE_URUT0 + '%"';

        db.query(sql, function(err, rows, fields) {
            response.send(rows);

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }
                    
                    obj['AUTH_EDIT'] = authEdit;
                    obj['AUTH_DELT'] = authDelt;

                    output.push(obj);
                })

                const filters = request.query;
                const filteredUsers = output.filter(item => {
                    let isValid = true;
                    for (var key in filters) {
                        isValid = isValid && item[key] == filters[key];
                    }
                    return isValid;
                });

                response.send(filteredUsers);
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
        
        var qryCmd = "select a.*, c.CODD_DESC As ProgDonatur, DATE_FORMAT(Tgl1, '%Y%m%d') As Tgl1Format, DATE_FORMAT(Tgl2, '%Y%m%d') As Tgl2Format, CASE a.CRTX_BYXX When '" + request.userID + "' Then '1' Else '0' END As AuthEdit FROM tblEvent a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.ProgramID = c.CODD_VALU And a.BUSS_CODE = c.CODD_VARC And c.CODD_FLNM = 'PROGRAM_DONATUR' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.EventID = '" + id + "' And a.IsDelete = '0'";
        
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
                    obj['AUTH_EDIT'] = fncAnd(authEdit, row.AuthEdit);
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

        var bussCode = req.body.BUSS_CODE;
        if (bussCode === '' || bussCode === undefined) {
            bussCode - req.BUSS_CODE0;
        }

        var sql = 'UPDATE tblEvent a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.EventID = "' + id + '" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';

        var data = {
            EventName : req.body.EventName,
            Description : req.body.Description,
            Tgl1 : req.body.Tgl1,
            Tgl2 : req.body.Tgl2,
            ProgramID : req.body.ProgramID,
            BUSS_CODE : bussCode,
            IDXX_GRPX : req.body.IDXX_GRPX,
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
        var id = req.body.selectedIds;  // EventID

        var sql = "update `tblEvent` set IsDelete = '1' where EventID = '" + id + "'";
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