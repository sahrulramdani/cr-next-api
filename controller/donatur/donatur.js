import  db from './../../koneksi.js';
import { fncParseComma, generateAutonumber } from './../../libraries/sisqu/Utility.js';
import moment from 'moment';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Donatur {
    donaturs = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var status = request.params.status;

        var qryCmd = "";
        if (status === "0") {   // All Status kecuali New dan Send Back
            qryCmd = "select a.NO_ID as id, a.NAMA, " +
                     "CASE a.JNKX_KLMN " +
                        "WHEN '1' THEN 'Laki-laki' " +
                        "ELSE 'Perempuan' " +
                      "END As Jns_Kelamin, " + 
                      "a.Email, a.NoHP, b.CODD_DESC As Channel, CONCAT(a.NAMA, ', ', IFNULL(a.TITLE, '')) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ''), a.NoHP) As NoHP2 from tb11_mzjb a INNER JOIN (select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR') b ON a.Channel = b.CODD_VALU INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT where a.Status <> '1' And a.Status <> '3' And c.KODE_URUT like '" + request.KODE_URUT0 + "%'";
        } else {
            qryCmd = "select a.NO_ID as id, a.NAMA, " +
                     "CASE a.JNKX_KLMN " +
                        "WHEN '1' THEN 'Laki-laki' " +
                        "ELSE 'Perempuan' " +
                      "END As Jns_Kelamin, " + 
                      "a.Email, a.NoHP, b.CODD_DESC As Channel, CONCAT(a.NAMA, ', ', IFNULL(a.TITLE, '')) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ''), a.NoHP) As NoHP2 from tb11_mzjb a INNER JOIN (select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR') b ON a.Channel = b.CODD_VALU INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT where a.Status = '" + status + "' And c.KODE_URUT like '" + request.KODE_URUT0 + "%'";
        };
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

    idDonaturs = (request, response) => {
        var status = request.params.status

        var qryCmd = "";
        if (status === "0") {
            // All, kecuali New dan Send Back
            qryCmd = "select a.NO_ID As value, CONCAT(a.NO_ID, ' - ', a.NAMA, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Status <> '1' And a.Status <> '3' And b.KODE_URUT like '" + req.KODE_URUT0 + "%' order by a.NO_ID";
        } else {
            qryCmd = "select a.NO_ID As value, CONCAT(a.NO_ID, ' - ', a.NAMA, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Status = '" + status + "' And b.KODE_URUT like '" + req.KODE_URUT0 + "%'  order by a.NO_ID";
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

    idDonatursAll = (request, response) => {
        var qryCmd = "select a.NO_ID As value, CONCAT(a.NO_ID, ' - ', a.NAMA, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.NO_ID";
        
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

    getDonatur = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;

        var sql = 'SELECT a.* FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"' ;
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

    getDonatursPerLevel = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var level = req.params.level;
        var sql = '';

        if (level === 'P') { // Donatur Platinum
            sql = 'SELECT * FROM tb11_mzjb WHERE FlgPlatinum = "1"';
        } else {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, d.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember FROM tb11_mzjb a inner join (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") b on a.TypeDonatur = b.CODD_VALU inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join (select * from tb00_basx where CODD_FLNM = "PEKERJAAN") d on a.Pekerjaan = d.CODD_VALU left join (select * from vtrans_donatur) e on a.NO_ID = e.DonaturID WHERE b.CODD_VARC >= "'+ level + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" ORDER BY a.NAMA';
        }
       
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

    getDonatursPerLevelPlatinum = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var level = req.params.level;  // Level : TypeDonatur (NEW, RETENSI, dll)
        var platinum = req.params.platinum;
        var sql = '';

        if (level === 'ALL') {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, d.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember, CASE a.FlgPlatinum When "1" Then "v" Else "" End As Platinum2 FROM tb11_mzjb a inner join (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") b on a.TypeDonatur = b.CODD_VALU inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join (select * from tb00_basx where CODD_FLNM = "PEKERJAAN") d on a.Pekerjaan = d.CODD_VALU left join (select * from vtrans_donatur) e on a.NO_ID = e.DonaturID WHERE c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.FlgPlatinum = "' + platinum + '" ORDER BY a.NAMA';
        } else {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, d.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember, CASE a.FlgPlatinum When "1" Then "v" Else "" End As Platinum2 FROM tb11_mzjb a inner join (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") b on a.TypeDonatur = b.CODD_VALU inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join (select * from tb00_basx where CODD_FLNM = "PEKERJAAN") d on a.Pekerjaan = d.CODD_VALU left join (select * from vtrans_donatur) e on a.NO_ID = e.DonaturID WHERE b.CODD_DESC = "'+ level + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.FlgPlatinum = "' + platinum + '" ORDER BY a.NAMA';
        }
       
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

    saveDonatur = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var noID;
        if (req.body.NO_ID === null || req.body.NO_ID === undefined) {
            noID = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            noID = req.body.NO_ID;
        }

        var sql = 'INSERT INTO tb11_mzjb SET ?';
        var data = {
            NO_ID : noID,
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            NICK_NAME : req.body.NICK_NAME,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            CodeCountryHP : req.body.CodeCountryHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.BUSS_CODE0,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum,
            Channel : req.body.Channel,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TITLE : req.body.TITLE,
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

    updateDonatur = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var id = req.body.NO_ID;

        var sql = 'UPDATE tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.NO_ID = "' + id + '" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        var data = {
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            NICK_NAME : req.body.NICK_NAME,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            CodeCountryHP : req.body.CodeCountryHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum,
            Channel : req.body.Channel,
            TITLE : req.body.TITLE,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC, 
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
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

    verify = function(req, res) {
        var status = req.body.Status;
        var typeDonatur = req.body.TypeDonatur;
        var tgl = moment(new Date()).format('YYYY-MM-DD');

        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
        console.log(selectedIds);
        var arrayLength = selectedIds.length;

        var sql = 'UPDATE tb11_mzjb SET Status = "' + status + '", TypeDonatur = "' + typeDonatur + '", UPDT_DATE = "' + tgl + '", UPDT_BYXX = "' + req.userID + '" WHERE NO_ID in ("';
        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                  sql += selectedIds[i] + '"' ;
                } else {
                  sql += ',"' + selectedIds[i] + '"';
                }
            } 
    
            sql += ')';
    
            console.log(sql);
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

    saveMasterFile = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb52_0001 SET ?';   // Tabel Master File Type Program Donatur
        var data = {
            FileName : req.body.FileName,
            FilePath : req.body.FilePath,
            Nama : req.body.Nama,
            TypeProgram : req.body.TypeProgram,
            TahunBuku : req.body.TahunBuku,
            Unit : req.BUSS_CODE0,
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
                //update File Path to /download/:id
                sql = 'update tb52_0001 set FilePath = CONCAT(FilePath, LAST_INSERT_ID()) where id = LAST_INSERT_ID()';
                db.query(sql, (err2, result2) => {
                    res.send({
                        status: true
                    });
                });
            }
        });
    } 

    getMasterFiles = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var typeProgram = request.params.typeProgram;
        var tahunBuku = request.params.tahunBuku;

        var qryCmd = "select * from tb52_0001 where TypeProgram = '" + typeProgram + "' And TahunBuku = '" + tahunBuku + "'";
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

    saveTransSLP = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb52_slpa SET ?';   

        var transNumber;
        if (req.body.transNumber === null || req.body.transNumber === undefined) {
            transNumber = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            transNumber = req.body.transNumber;
        }

        var data = {
            transNumber : transNumber,
            tglProses : req.body.tglProses,
            typeProgram : req.body.typeProgram,
            status : req.body.status,
            tahunBuku : req.body.tahunBuku,
            Message : req.body.Message,
            unit : req.BUSS_CODE0,
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

    // Save Detail Transaksi SLP Attachments
    saveDetTransSLP1 = function(req, res) {
        var sql = 'INSERT INTO tb52_slpb SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            fileID : req.body.fileID,
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

    // get Transaksi SLP Detail Attachments
    getSLPAttachments = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var transNumber = req.params.transNumber;

        var sql = 'SELECT a.*, b.FileName FROM tb52_slpb a inner join tb52_0001 b on a.FileID = b.id  WHERE a.transNumber = "'+ transNumber +'"';
        
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

    deleteSLPAttachment = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `tb52_slpb` where id = " + id;
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

    // Save Detail Transaksi SLP Donaturs
    saveDetTransSLP2 = function(req, res) {
        var sql = 'INSERT INTO tb52_slpc SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            donaturID : req.body.donaturID,
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

    // get Transaksi SLP Detail Donaturs
    getSLPDonaturs = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var transNumber = req.params.transNumber;

        var sql = 'SELECT a.*, b.NAMA, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2 FROM tb52_slpc a inner join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT WHERE a.transNumber = "'+ transNumber +'" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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

    deleteSLPDonatur = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `tb52_slpc` where id = " + id;
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

    transSLPAll = (request, response) => {
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var status = request.params.status;

        var qryCmd = '';
        if (status === 'all') {
            qryCmd = "select a.*, DATE_FORMAT(a.tglProses, '%d/%m/%Y') As tglProsesFormat, b.CODD_DESC As TypeProgram2, " + 
            "Case a.status " + 
            "When '1' Then 'SEND'" + 
            "Else 'NOT SEND YET'" +
            "End As Status2 " +
            "from tb52_slpa a left join (select * from tb00_basx where CODD_FLNM = 'TYPE_PROGRAM_DONATUR') b on a.typeProgram = b.CODD_VALU inner join tb00_unit c on a.unit = c.KODE_UNIT where c.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.transNumber";
        } else {
            qryCmd = "select a.transNumber, CONCAT(IFNULL(e.CodeCountryHP, ''), e.NoHP) As NoHP2, a.Message, f.FilePath, CONCAT(f.fileID, '|', f.FileName) As FileName, e.TITLE, e.NAMA from tb52_slpa a left join (select * from tb00_basx where CODD_FLNM = 'TYPE_PROGRAM_DONATUR') b on a.typeProgram = b.CODD_VALU inner join tb00_unit c on a.unit = c.KODE_UNIT inner join tb52_slpc d on a.transNumber = d.transNumber inner join tb11_mzjb e on d.donaturID = e.NO_ID left join vslpattach f on a.transNumber = f.transNumber where c.KODE_URUT like '" + request.KODE_URUT0 + "%' And d.status = '" + status + "' And a.Message is not null order by a.transNumber";
        }

        db.query(qryCmd, function(err, rows, fields) {
            if (err) {
                throw err;
                return;
            }

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

    deleteTransSLP = function(req, res) {
        var transNumber = req.body.id;
        var sql = "delete from `tb52_slpa` where transNumber = '" + transNumber + "'";
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

    getTransSLP = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var transNumber = req.params.id;

        var sql = 'SELECT a.*, c.CODD_VARC As Level FROM tb52_slpa a INNER JOIN (select * from tb00_basx where CODD_FLNM = "TYPE_PROGRAM_DONATUR") b ON a.typeProgram = b.CODD_VALU LEFT JOIN (select * from tb00_basx where CODD_FLNM = "TYPE_DONATUR") c ON b.CODD_VARC = c.CODD_DESC WHERE a.transNumber = "'+ transNumber +'"';
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

    updateTransSLP = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var transNumber = req.body.transNumber;
        var sql = 'UPDATE tb52_slpa SET ? WHERE transNumber = "' + transNumber + '"';   
        var data = {
            tglProses : req.body.tglProses,
            typeProgram : req.body.typeProgram,
            status : req.body.status,
            tahunBuku : req.body.tahunBuku,
            Message : req.body.Message,
            unit : req.BUSS_CODE0,
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

    masterFileAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.*, b.CODD_DESC As TypeProgram2 from tb52_0001 a inner join (select * from tb00_basx where CODD_FLNM = 'TYPE_PROGRAM_DONATUR') b on a.typeProgram = b.CODD_VALU order by a.id desc";
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

    // Get Detail Transactions
    getDetTransactions = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var donaturID = req.params.donaturID;

        var sql = 'SELECT a.*, b.NAMA, DATE_FORMAT(a.TransDate, "%d/%m/%Y") As TransDateFormat FROM trans_donatur a inner join tb11_mzjb b on a.donaturID = b.NO_ID WHERE b.NO_ID = "'+ donaturID +'" And (a.isDelete <> "1" OR a.isDelete IS NULL)';
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
            }

            res.send(output);
        });
    }

    // Save Detail Transaction Donatur
    saveDetTransaction = function(req, res) {
        var sql = 'INSERT INTO trans_donatur SET ?';   

        var transNumber;
        if (req.body.TransNumber === null || req.body.TransNumber === undefined) {
            transNumber = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            transNumber = req.body.TransNumber;
        }

        var data = {
            TransNumber : transNumber,
            TransDate : req.body.TransDate,
            NoReference : req.body.NoReference,
            DonaturID : req.body.DonaturID,
            CurrencyID : req.body.CurrencyID,
            Amount : req.body.Amount,
            FileName : req.body.FileName,
            ProgDonatur : req.body.ProgDonatur,
            MethodPayment : req.body.MethodPayment,
            BankFrom : req.body.BankFrom,
            BankTo : req.body.BankTo,
            Catatan : req.body.Catatan,
            isValidate : req.body.isValidate,
            isDelete : req.body.isDelete,
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

    deleteDetTransaction = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `trans_donatur` where id = " + id;
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

    // Get Transactions Donatur (money transfer)
    getDonaturTransactions = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var isValid = req.params.isValid;
        var sql = '';

        if (isValid === '0') {
            isValid = '0",null';
        } else if (isValid === '1') {
            isValid = '1"';
        }

        if (isValid === 'all') {
            sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, d.CODD_DESC As Channel FROM trans_donatur a inner join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT inner join (select * from tb00_basx where CODD_FLNM = "CHANNEL_DONATUR") d on b.Channel = d.CODD_VALU WHERE (a.isDelete <> "1" Or a.isDelete Is Null) And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        } else {
            sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(TransDate, "%d/%m/%Y %H:%i") As TransDateFormat, d.CODD_DESC As Channel FROM trans_donatur a inner join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT inner join (select * from tb00_basx where CODD_FLNM = "CHANNEL_DONATUR") d on b.Channel = d.CODD_VALU WHERE a.isValidate in ("' + isValid + ') And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        }

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
            }

            res.send(output);
        });
    }

    updateDonaturTrans = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var id = req.body.id;
        var NoReference2 = req.body.NoReference2;

        var sql = 'UPDATE trans_donatur a INNER JOIN tb11_mzjb b ON a.DonaturID = b.NO_ID INNER JOIN tb00_unit c ON b.BUSS_CODE = c.KODE_UNIT SET ? WHERE a.id = ' + id + ' And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
           
        var data = {
            TransDate : req.body.TransDate,
            NoReference : req.body.NoReference,
            CurrencyID : req.body.CurrencyID,
            Amount : req.body.Amount,
            FileName : req.body.FileName,
            ProgDonatur : req.body.ProgDonatur,
            MethodPayment : req.body.MethodPayment,
            BankFrom : req.body.BankFrom,
            BankTo : req.body.BankTo,
            Catatan : req.body.Catatan,
            'a.isValidate' : req.body.isValidate,
            'a.isDelete' : req.body.isDelete,
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
                // update Donatur is verified
                sql = 'UPDATE `tb11_mzjb` SET Status = "4" WHERE NO_ID = "' + req.body.DonaturID + '" And Status <> "4"';
                db.query(sql, (err, result) => {
                    // update tabel mutasi - TransNumber (link ke tabel Transaksi Donatur)
                    if (NoReference2 !== null && NoReference2 !== undefined) {
                        sql = 'UPDATE `tblMutasi` SET TransNumber = "' + req.body.transNumber + '" WHERE NoReference = "' + NoReference2 + '"';

                        db.query(sql, (err, result) => {
                            res.send({
                                status: true
                            });
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

    // soft delete
    deleteSoftDonaturTrans = function(req, res) {
        var id = req.body.id;
        var sql = 'UPDATE trans_donatur SET ? WHERE id = ' + id;   
        var data = {
            isDelete : req.body.isDelete,
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

    // get Donatur Transaction
    getTransaction = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;

        var sql = 'SELECT a.*, CONCAT(a.DonaturID, " - ", b.NAMA) As Donatur2 FROM trans_donatur a INNER JOIN tb11_mzjb b ON a.DonaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT WHERE a.id = "'+ id +'" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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
            }

            res.send(output);
        });
    }

    getTransactionsFilter = function(req, res) {
        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;

        var sql = "select c.CODD_DESC As Channel, SUM(a.Amount) As Total from trans_donatur a inner join tb11_mzjb b on a.DonaturID = b.NO_ID inner join (select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR') c on b.Channel = c.CODD_VALU where a.isValidate = '1' And DATE_FORMAT(a.TransDate, '%Y-%m-%d') between '" + tgl1 + "' and '" + tgl2 + "' group by c.CODD_DESC";
    
        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    updateTransSLPDonatur = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var transNumber = req.body.transNumber;
        var noHP = req.body.NoHP;
        var status = req.body.status;

        var sql = 'UPDATE tb52_slpc a INNER JOIN tb52_slpa b ON a.transNumber = b.transNumber INNER JOIN tb00_unit c ON b.unit = c.KODE_UNIT INNER JOIN tb11_mzjb d ON a.donaturID = d.NO_ID SET a.status = "' + status + '" WHERE a.transNumber = "' + transNumber + '" And d.NoHP = "' + noHP + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        
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