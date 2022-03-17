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
                      "a.Email, a.NoHP, b.CODD_DESC As Channel, CONCAT(a.NAMA, ', ', IFNULL(a.TITLE, '')) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ''), a.NoHP) As NoHP2 from tb11_mzjb a INNER JOIN tb00_basx b ON a.Channel = b.CODD_VALU And b.CODD_FLNM = 'CHANNEL_DONATUR' INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT where a.Status <> '1' And a.Status <> '3' And c.KODE_URUT like '" + request.KODE_URUT0 + "%'";
        } else {
            qryCmd = "select a.NO_ID as id, a.NAMA, " +
                     "CASE a.JNKX_KLMN " +
                        "WHEN '1' THEN 'Laki-laki' " +
                        "ELSE 'Perempuan' " +
                      "END As Jns_Kelamin, " + 
                      "a.Email, a.NoHP, b.CODD_DESC As Channel, CONCAT(a.NAMA, ', ', IFNULL(a.TITLE, '')) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ''), a.NoHP) As NoHP2, IFNULL(d.CODD_DESC, '') As SegmenProf, a.ALMT_XXX1 FROM tb11_mzjb a INNER JOIN tb00_basx b ON a.Channel = b.CODD_VALU And b.CODD_FLNM = 'CHANNEL_DONATUR' INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT LEFT JOIN tb00_basx d ON a.SEGMX_PROF = d.CODD_VALU And d.CODD_FLNM = 'SEGMENT_PROFILING' where a.Status = '" + status + "' And c.KODE_URUT like '" + request.KODE_URUT0 + "%'";
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
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;

        var typePrson = request.TYPE_PRSON0;
        var typeRelawan = request.TypeRelawan0;
        var qryCmd = '';
        
        if (typePrson === '1') {  // 1: Relawan
            qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb01_lgxh c on a.RelawanID = c.NO_ID left join tb21_empl e on a.RelawanID = e.KodeNik left join tb00_unit b on e.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(c.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by a.NAMA";

            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' : // 04: Korra keatas
                    qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a left join vfirst_relawandet c on a.RelawanID = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX left join tb21_empl e on a.RelawanID = e.KodeNik left join tb00_unit b on e.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And d.KodeKelurahan like '" + request.KODE_AREA0 + "%' order by a.NAMA";

                    break;
                case '05' : // bendahara
                    qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a left join vfirst_relawandet c on a.RelawanID = c.RelawanID left join tb21_empl e on a.RelawanID = e.KodeNik left join tb00_unit b on e.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And c.groupID = '" + request.groupID + "' order by a.NAMA";

                    break;
                case '06' :
                    qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb01_lgxh c on a.RelawanID = c.NO_ID left join tb21_empl e on a.RelawanID = e.KodeNik left join tb00_unit b on e.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(c.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by a.NAMA";

                    break;
            }
        } else if (typePrson === '2') {  // 2: Donatur
            qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb01_lgxh c on a.NO_ID = c.NO_ID where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(c.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by a.NAMA";
        } else {
            qryCmd = "select a.NO_ID As value, CONCAT(a.NAMA, ' - ', a.NO_ID, ' - ', SUBSTRING(a.ALMT_XXX1, 1, 20)) As label from tb11_mzjb a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.NAMA";
        }
        
        db.query(qryCmd, function(err, rows, fields) {
            var output = [];

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj['AUTH_ADDX'] = authAdd;
                    obj['AUTH_EDIT'] - authEdit;

                    output.push(obj);
                })

                response.send(output);
            } else {
                response.send([]);
            }
        });
    }

    getDonaturProfile = function(req, res) {
        var sql = 'SELECT a.* FROM tb11_mzjb a inner join tb01_lgxh b on a.NO_ID = b.NO_ID WHERE UPPER(b.USER_IDXX) = "' + req.userID.toUpperCase() + '"';

        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    getDonatur = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var typePrson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;
        var id = req.params.id;

        var sql = '';
        if (typePrson === '1') {  // 1: Relawan
            sql = 'SELECT a.*, c.TYPE_PRSON, e.groupID FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT INNER JOIN tb21_empl d on a.RelawanID = d.KodeNik LEFT JOIN tb01_lgxh c ON d.KodeNik = c.NO_ID left join vfirst_relawanDet e on a.RelawanID = e.RelawanID WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" And UPPER(c.USER_IDXX) = "' + req.userID.toUpperCase() + '"';

            if (typeRelawan === '05') {  // 05: Bendahara Group
                sql = 'SELECT a.*, c.TYPE_PRSON, e.groupID FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT INNER JOIN tb21_empl d on a.RelawanID = d.KodeNik LEFT JOIN tb01_lgxh c ON d.KodeNik = c.NO_ID left join vfirst_relawanDet e on a.RelawanID = e.RelawanID WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" And e.groupID = "' + req.groupID + '"';
            }

            if (typeRelawan <= '04') {   // 04: Korra
                sql = 'SELECT a.*, c.TYPE_PRSON, e.groupID FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT INNER JOIN tb21_empl d on a.RelawanID = d.KodeNik LEFT JOIN tb01_lgxh c ON d.KodeNik = c.NO_ID left join vfirst_relawanDet e on a.RelawanID = e.RelawanID left join grpx_relx f on e.groupID = f.IDXX_GRPX WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" And f.KodeKelurahan like "' + req.KODE_AREA0 + '%"';
            }
        } else if (typePrson === '2') {   // 2: Donatur
            sql = 'SELECT a.*, c.TYPE_PRSON, d.groupID FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT inner join tb01_lgxh c on a.NO_ID = c.NO_ID left join vfirst_relawanDet d on a.RelawanID = d.RelawanID WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" And UPPER(c.USER_IDXX) = "' + req.userID.toUpperCase() + '"';
        } else {
            sql = 'SELECT a.*, c.groupID FROM tb11_mzjb a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.RelawanID = c.RelawanID WHERE a.NO_ID = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        }

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

    getRelawanDonatur = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve
        
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;
        var id = req.params.id;   // NO_ID
        
        var sql = 'select a.*, d.TYPE_PRSON FROM tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join tb01_lgxh d on a.NO_ID = d.NO_ID where c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.NO_ID = "' + id + '"';

        if (typePerson === '1') {   // 1: Relawan
            if (typeRelawan === '06') {   // 06: Relawan
                var sql = 'select a.*, d.TYPE_PRSON FROM tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join tb01_lgxh d on a.NO_ID = d.NO_ID where c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.NO_ID = "' + id + '" And UPPER(d.USER_IDXX) = "' + req.userID.toUpperCase() + '"';
            }

            if (typeRelawan === '05') {  // 05: Bendahara group
                var sql = 'select a.*, d.TYPE_PRSON FROM tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join tb01_lgxh d on a.NO_ID = d.NO_ID left join vfirst_relawandet e on b.KodeNik = e.RelawanID where c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.NO_ID = "' + id + '" And e.groupID = "' + req.groupID + '"';
            }

            if (typeRelawan <= '04') {  // 04: Korra
                var sql = 'select a.*, d.TYPE_PRSON FROM tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join tb01_lgxh d on a.NO_ID = d.NO_ID left join vfirst_relawandet e on b.KodeNik = e.RelawanID left join grpx_relx f on e.groupID = f.IDXX_GRPX where c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.NO_ID = "' + id + '" And f.KodeKelurahan like "' + req.KODE_AREA0 + '%"';
            }
        }

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
        var authPrnt = req.AUTH_PRNT;

        var level = req.params.level;
        var sql = '';

        if (level === 'P') { // Donatur Platinum
            sql = 'SELECT * FROM tb11_mzjb WHERE FlgPlatinum = "1"';
        } else {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, d.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember, f.CODD_DESC As SegmenProfil, c.NAMA_UNIT, CASE a.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active FROM tb11_mzjb a inner join  tb00_basx b on a.TypeDonatur = b.CODD_VALU And b.CODD_FLNM = "TYPE_DONATUR" inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on a.Pekerjaan = d.CODD_VALU And d.CODD_FLNM = "PEKERJAAN" left join vtrans_donatur e on a.NO_ID = e.DonaturID left join tb00_basx f on a.SEGMX_PROF = f.CODD_VALU And f.CODD_FLNM = "SEGMENT_PROFILING" WHERE b.CODD_VARC >= "'+ level + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" ORDER BY a.NAMA';
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
                    obj['AUTH_PRNT'] = authPrnt;

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
        var active = req.params.active;
        var sql = '';

        if (level === 'ALL') {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, g.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember, CASE a.FlgPlatinum When "1" Then "v" Else "" End As Platinum2, f.CODD_DESC As SegmenProfil, CASE a.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active FROM tb11_mzjb a inner join tb00_basx b on a.TypeDonatur = b.CODD_VALU And b.CODD_FLNM = "TYPE_DONATUR" inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx g on a.Pekerjaan = g.CODD_VALU And g.CODD_FLNM = "PEKERJAAN" left join (select * from vtrans_donatur) e on a.NO_ID = e.DonaturID left join tb00_basx f on a.SEGMX_PROF = f.CODD_VALU And f.CODD_FLNM = "SEGMENT_PROFILING" WHERE c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.FlgPlatinum = "' + platinum + '" And b.CODD_VARC >= 2 And a.Stat_aktf = "' + active + '" ORDER BY a.NAMA';
        } else {
            sql = 'SELECT a.*, b.CODD_DESC As TypeDonatur2, a.flgPlatinum As Platinum, DATE_FORMAT(a.TglX_MASK, "%e-%b-%Y") As TglMasuk, CONCAT(a.NAMA, ", ", IFNULL(a.TITLE, "")) As Nama2, CONCAT(IFNULL(a.CodeCountryHP, ""), a.NoHP) As NoHP2, d.CODD_DESC As Profesi, IFNULL(e.TotalDonasi, 0) As TotalDonasi, e.TahunDonasi, e.Januari, e.Februari, e.Maret, e.April, e.Mei, e.Juni, e.Juli, e.Agustus, e.September, e.Oktober, e.November, e.Desember, CASE a.FlgPlatinum When "1" Then "v" Else "" End As Platinum2, f.CODD_DESC As SegmenProfil, CASE a.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active FROM tb11_mzjb a inner join tb00_basx b on a.TypeDonatur = b.CODD_VALU And b.CODD_FLNM = "TYPE_DONATUR" inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on a.Pekerjaan = d.CODD_VALU And d.CODD_FLNM = "PEKERJAAN" left join vtrans_donatur e on a.NO_ID = e.DonaturID left join tb00_basx f on a.SEGMX_PROF = f.CODD_VALU And f.CODD_FLNM = "SEGMENT_PROFILING" WHERE b.CODD_DESC = "'+ level + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.FlgPlatinum = "' + platinum + '" And a.Stat_aktf = "' + active + '" ORDER BY a.NAMA';
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

    saveDonaturProfile = function(req, res) {
        var noID;
        if (req.body.NO_ID === null || req.body.NO_ID === undefined) {
            noID = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            noID = req.body.NO_ID;
        }

        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var sql = 'INSERT INTO tb11_mzjb SET ?';
        var data = {
            NO_ID : noID,
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            NICK_NAME : req.body.NICK_NAME,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            AlamatDomisili : req.body.AlamatDomisili,
            NoHP : req.body.NoHP,
            CodeCountryHP : req.body.CodeCountryHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : bussCode,
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
                // update tabel tb01_lgxh, field NO_ID
                sql = 'update tb01_lgxh set NO_ID = "' + noID + '" where USER_IDXX = "' + req.userID + '"';
                db.query(sql, (err2, result2) => {
                    res.send({
                        status: true,
                        NO_ID: noID
                    });
                });
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

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
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
            AlamatDomisili : req.body.AlamatDomisili,
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
            SEGMX_PROF : req.body.SEGMX_PROF,
            RelawanID : req.body.RelawanID,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TITLE : req.body.TITLE,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                sql = 'update tb11_mzjb a inner join vfirst_relawandet b on a.RelawanID = b.RelawanID inner join grpx_relx c on b.groupID = c.IDXX_GRPX left join tb00_unit d on c.BUSS_CODE = d.KODE_UNIT set a.IDXX_GRPX = b.groupID, a.BUSS_CODE = c.BUSS_CODE where NO_ID = "' + noID + '" And d.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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
        });
    }

    updateDonaturProfile = function(req, res) {
        var sql = 'UPDATE tb11_mzjb a INNER JOIN tb01_lgxh b ON a.NO_ID = b.NO_ID SET ? WHERE UPPER(b.USER_IDXX) = "' + req.userID.toUpperCase() + '"';

        var data = {
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            NICK_NAME : req.body.NICK_NAME,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            AlamatDomisili : req.body.AlamatDomisili,
            NoHP : req.body.NoHP,
            CodeCountryHP : req.body.CodeCountryHP,
            'a.Email' : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            TglX_MASK : req.body.TglX_MASK,
            TypeBadan : req.body.TypeBadan,
            TITLE : req.body.TITLE,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC, 
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            'a.UPDT_DATE' : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
            AlamatDomisili : req.body.AlamatDomisili,
            NoHP : req.body.NoHP,
            CodeCountryHP : req.body.CodeCountryHP,
            'a.Email' : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            NoKTP : req.body.NoKTP,
            Stat_aktf : req.body.Stat_aktf,
            StatusKawin : req.body.StatusKawin,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum,
            Channel : req.body.Channel,
            SEGMX_PROF : req.body.SEGMX_PROF,
            RelawanID : req.body.RelawanID,
            TITLE : req.body.TITLE,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC, 
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            'a.UPDT_DATE' : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                if (req.body.IsChangeGroup === '1') {   // 1: True
                    sql = 'update tb11_mzjb a left join vfirst_relawandet d on a.RelawanID = d.RelawanID left join grpx_relx e on d.groupID = e.IDXX_GRPX left join tb00_unit c on e.BUSS_CODE = c.KODE_UNIT set a.BUSS_CODE = e.BUSS_CODE, a.IDXX_GRPX = d.groupID where a.NO_ID = "' + id + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
                } else {
                    sql = 'update tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT set a.BUSS_CODE = b.BUSS_CODE where a.NO_ID = "' + id + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
                }

                db.query(sql, (err, result) => {
                    res.send({
                        status: true
                    });
                });
            }
        });
    }

    verify = function(req, res) {
        var status = req.body.Status;
        var typeDonatur = req.body.TypeDonatur;
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
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
            Unit : req.body.Unit,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                    if (req.body.FlgSaveDetSlpa === '1') {
                        var tglNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                        sql = 'INSERT INTO tb52_slpb (transNumber, fileID, CRTX_DATE, CRTX_BYXX) VALUES ("' + req.body.transNumber + '", LAST_INSERT_ID(), "' + tglNow + '", "' + req.userID + '")';   

                        db.query(sql, (err2, result2) => {
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

    getMasterFiles = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var typeProgram = request.params.typeProgram;
        var tahunBuku = request.params.tahunBuku;

        var qryCmd = "select * from tb52_0001 where TypeProgram = '" + typeProgram + "' And TahunBuku = '" + tahunBuku + "' And Unit = '" + request.BUSS_CODE0 + "'";

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
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                    transNumber: transNumber
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
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var sql = 'INSERT INTO tb52_slpc SET ?';   
        var data = {
            transNumber : req.body.transNumber,
            donaturID : req.body.donaturID,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
            qryCmd = "select a.*, DATE_FORMAT(a.tglProses, '%d/%m/%Y') As tglProsesFormat, b.Description As TypeProgram2, " + 
            "Case a.status " + 
            "When '1' Then 'SEND'" + 
            "Else 'NOT SEND YET'" +
            "End As Status2 " +
            "from tb52_slpa a left join typeslp b on a.typeProgram = b.id inner join tb00_unit c on a.unit = c.KODE_UNIT where c.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.tglProses DESC";
        } else {
            qryCmd = "select a.transNumber, CONCAT(IFNULL(e.CodeCountryHP, ''), e.NoHP) As NoHP2, a.Message, f.FilePath, CONCAT(f.fileID, '|', f.FileName) As FileName, e.TITLE, e.NAMA, e.NICK_NAME, a.tglProses FROM tb52_slpa a left join typeslp b on a.typeProgram = b.id inner join tb00_unit c on a.unit = c.KODE_UNIT inner join tb52_slpc d on a.transNumber = d.transNumber inner join tb11_mzjb e on d.donaturID = e.NO_ID left join vslpattach f on a.transNumber = f.transNumber where c.KODE_URUT like '" + request.KODE_URUT0 + "%' And d.status = '" + status + "' And a.Message is not null order by a.transNumber";
        }

        db.query(qryCmd, function(err, rows, fields) {
            if (err) {
                throw err;
                // return;
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

        var sql = 'SELECT a.*, c.CODD_VARC As Level FROM tb52_slpa a LEFT JOIN typeslp b ON a.typeProgram = b.id LEFT JOIN tb00_basx c ON b.TypeDonaturMin = c.CODD_DESC And c.CODD_FLNM = "TYPE_DONATUR" WHERE a.transNumber = "'+ transNumber +'"';
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
            UPDT_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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

        var qryCmd = "select a.*, b.Description As TypeProgram2 from tb52_0001 a inner join typeslp b on a.typeProgram = b.id inner join tb00_unit c on a.Unit = c.KODE_UNIT where a.TypeProgram <> '14' And c.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.id desc";
        
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

        var sql = 'SELECT a.*, b.NAMA, DATE_FORMAT(a.TransDate, "%d/%m/%Y") As TransDateFormat FROM trans_donatur a inner join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT left join tb00_unit d on a.BUSS_CODE = d.KODE_UNIT WHERE b.NO_ID = "'+ donaturID +'" And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And d.KODE_URUT like "' + req.KODE_URUT0 + '%" order by a.TransDate Desc';

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

        var namaFile = '';
        if (req.body.extension !== undefined) {
            namaFile = 'transaction_' + transNumber + '.' + req.body.extension;
        }

        var data = {
            TransNumber : transNumber,
            TransDate : req.body.TransDate,
            BUSS_CODE : req.body.BUSS_CODE,
            NoReference : req.body.NoReference,
            DonaturID : req.body.DonaturID,
            CurrencyID : req.body.CurrencyID,
            Amount : req.body.Amount,
            FileName : namaFile,
            ProgDonatur : req.body.ProgDonatur,
            MethodPayment : req.body.MethodPayment,
            BankFrom : req.body.BankFrom,
            BankTo : req.body.BankTo,
            Catatan : req.body.Catatan,
            KodeNik : req.body.KodeNik,
            KODE_KLSX : req.body.KODE_KLSX,
            TahunBuku : req.body.TahunBuku,
            isValidate : req.body.isValidate,
            isDelete : req.body.isDelete,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                    transNumber: transNumber,
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
        var authPrnt = req.AUTH_PRNT;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;

        var isValid = req.params.isValid;
        var isValid2 = '0';
        var isValid3 = '0';
        var isValid4 = '0';    // Validasi Relawan Offisial
        var isValidTransfer = '0';

        var bussCode = '%';
        var sql = '';

        if (isValid === '0') {
            isValid = '0",null';
        } else if (isValid === '1') {
            isValid = '1"';
        }

        if (req.params.bussCode !== undefined) {
            bussCode = req.params.bussCode;
        }

        if (isValid === 'all') {
            sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, d.CODD_DESC As Channel, DATE_FORMAT(a.TransDate, "%Y-%b-%e") As TglFormat FROM trans_donatur a inner join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT inner join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" WHERE (a.isDelete <> "1" Or a.isDelete Is Null) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And c.KODE_UNIT like "' + bussCode + '" And (a.isDelete <> "1" OR a.isDelete IS NULL) order by a.TransDate Desc';
        } else {
            if (typePerson === '1') {  // 1: Relawan
                switch(typeRelawan) {
                    case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                        if (isValid === '0",null') {
                            isValid = '1"';
                            isValid2 = '0';
                            isValidTransfer = '0';
                        } else {
                            isValid2 = '1';
                            isValidTransfer = '1';
                        }

                        sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(a.TransDate, "%Y%m%d %H:%i:%s") As TransDateFormat, DATE_FORMAT(a.TransDate, "%d/%m/%Y %H:%i:%s") As TglFormat, d.CODD_DESC As Channel, e.TahunDonasi, b.TITLE, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2, g.Department, h.NAMA_BANK As Bank, i.CODD_DESC As SegmenProfil, c.NAMA_UNIT, CASE b.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active, a.Amount, Case n.CHKX_CASH When "1" Then "TUNAI" Else "TRANSFER" End As ChkTunai FROM trans_donatur a left join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" left join vfirst_transaction e on a.DonaturID = e.DonaturID left join vdepartment g on a.CRTX_BYXX = g.USER_IDXX left join tb02_bank h on a.BankTo = h.KODE_BANK And h.KODE_FLNM = "KASX_BANK" left join tb00_basx i on b.SEGMX_PROF = i.CODD_VALU And i.CODD_FLNM = "SEGMENT_PROFILING" left join vfirst_relawandet l on a.KodeNik = l.RelawanID left join grpx_relx m on l.groupID = m.IDXX_GRPX left join tb02_bank n on a.MethodPayment = n.KODE_BANK And a.BUSS_CODE = n.BUSS_CODE And n.KODE_FLNM = "TYPE_BYRX" WHERE ((n.CHKX_CASH = "1" And a.isValidate in ("' + isValid + ') And a.isValidate2 = "' + isValid2 + '") Or (n.CHKX_CASH = "0" And a.isValidate = "' + isValidTransfer + '")) And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And m.KodeKelurahan like "' + req.KODE_AREA0 + '%" order by c.KODE_URUT, a.TransDate Desc, a.TransNumber';

                        break;
                    case '05' :  // Bendahara
                        sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(a.TransDate, "%Y%m%d %H:%i:%s") As TransDateFormat, DATE_FORMAT(a.TransDate, "%d/%m/%Y %H:%i:%s") As TglFormat, d.CODD_DESC As Channel, e.TahunDonasi, b.TITLE, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2, g.Department, h.NAMA_BANK As Bank, i.CODD_DESC As SegmenProfil, c.NAMA_UNIT, CASE b.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active, a.Amount, Case n.CHKX_CASH When "1" Then "TUNAI" Else "TRANSFER" End As ChkTunai FROM trans_donatur a left join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" left join vfirst_transaction e on a.DonaturID = e.DonaturID left join vdepartment g on a.CRTX_BYXX = g.USER_IDXX left join tb02_bank h on a.BankTo = h.KODE_BANK And h.KODE_FLNM = "KASX_BANK" left join tb00_basx i on b.SEGMX_PROF = i.CODD_VALU And i.CODD_FLNM = "SEGMENT_PROFILING" left join vfirst_relawandet l on a.KodeNik = l.RelawanID left join grpx_relx m on l.groupID = m.IDXX_GRPX left join tb02_bank n on a.MethodPayment = n.KODE_BANK And a.BUSS_CODE = n.BUSS_CODE And n.KODE_FLNM = "TYPE_BYRX" WHERE ((n.CHKX_CASH = "1" And a.isValidate in ("' + isValid + ')) Or (n.CHKX_CASH = "0" And a.isValidate in ("' + isValid + '))) And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And m.IDXX_GRPX = "' + req.groupID + '" order by c.KODE_URUT, a.TransDate Desc, a.TransNumber';

                        break;
                    case '06' :
                        if (isValid === '0",null') {
                            isValid2 = '0';
                            isValid3 = '0';
                        } else {
                            isValid2 = '1';
                            isValid3 = '1';
                        }
    
                        sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(a.TransDate, "%Y%m%d %H:%i:%s") As TransDateFormat, DATE_FORMAT(a.TransDate, "%d/%m/%Y %H:%i:%s") As TglFormat, d.CODD_DESC As Channel, e.TahunDonasi, b.TITLE, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2, g.Department, h.NAMA_BANK As Bank, i.CODD_DESC As SegmenProfil, c.NAMA_UNIT, CASE b.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active, a.Amount, Case n.CHKX_CASH When "1" Then "TUNAI" Else "TRANSFER" End As ChkTunai FROM trans_donatur a left join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" left join vfirst_transaction e on a.DonaturID = e.DonaturID left join vdepartment g on a.CRTX_BYXX = g.USER_IDXX left join tb02_bank h on a.BankTo = h.KODE_BANK And h.KODE_FLNM = "KASX_BANK" left join tb00_basx i on b.SEGMX_PROF = i.CODD_VALU And i.CODD_FLNM = "SEGMENT_PROFILING" left join tb01_lgxh l on b.RelawanID = l.NO_ID left join tb02_bank n on a.MethodPayment = n.KODE_BANK And a.BUSS_CODE = n.BUSS_CODE And n.KODE_FLNM = "TYPE_BYRX" WHERE ((n.CHKX_CASH = "1" And a.isValidate in ("' + isValid + ') And a.isValidate2 = "' + isValid2 + '" And a.isValidate3 = "' + isValid3 + '") Or (n.CHKX_CASH = "0" And a.isValidate in ("' + isValid + '))) And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And UPPER(l.USER_IDXX) = "' + req.userID.toUpperCase() + '" order by c.KODE_URUT, a.TransDate Desc, a.TransNumber';
                }
            } else if (typePerson === '4') {    // 4: Ofisial
                if (isValid === '0",null') {
                    isValid = '1"';
                    isValid2 = '1';
                    isValid3 = '0';
                    isValid4 = '0';
                    isValidTransfer = '0';
                } else {
                    isValid2 = '1';
                    isValid3 = '1';
                    isValid4 = '1';
                    isValidTransfer = '1';
                }
    
                sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(a.TransDate, "%Y%m%d %H:%i:%s") As TransDateFormat, DATE_FORMAT(a.TransDate, "%d/%m/%Y %H:%i:%s") As TglFormat, d.CODD_DESC As Channel, e.TahunDonasi, b.TITLE, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2, g.Department, h.NAMA_BANK As Bank, i.CODD_DESC As SegmenProfil, c.NAMA_UNIT, CASE b.Stat_aktf When "1" Then "AKTIF" Else "NON-AKTIF" END As Active, a.Amount, Case j.CHKX_CASH When "1" Then "TUNAI" Else "TRANSFER" End As ChkTunai FROM trans_donatur a left join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" left join vfirst_transaction e on a.DonaturID = e.DonaturID And e.DonaturID is not null left join vdepartment g on a.CRTX_BYXX = g.USER_IDXX left join tb02_bank h on a.BankTo = h.KODE_BANK And h.KODE_FLNM = "KASX_BANK" left join tb00_basx i on b.SEGMX_PROF = i.CODD_VALU And i.CODD_FLNM = "SEGMENT_PROFILING" left join tb02_bank j on a.MethodPayment = j.KODE_BANK And a.BUSS_CODE = j.BUSS_CODE And j.KODE_FLNM = "TYPE_BYRX" left join vfirst_relawandet k on a.KodeNik = k.RelawanID WHERE ((j.CHKX_CASH = "1" And a.isValidate in ("' + isValid + ') And a.isValidate2 = "' + isValid2 + '" And a.isValidate3 = "' + isValid3 + '") Or (j.CHKX_CASH = "0" And a.isValidate = "' + isValidTransfer + '") Or (j.CHKX_CASH = "1" And k.groupID Is Null And a.isValidate in ("' + isValid4 + '"))) And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "%' + req.KODE_URUT0 + '%" order by c.KODE_URUT, a.TransDate Desc, a.TransNumber';
            }
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
                    obj['AUTH_PRNT'] = authPrnt;

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
        // var NoReference2 = req.body.NoReference2;

        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var sql = 'UPDATE trans_donatur a INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT SET ? WHERE a.id = ' + id + ' And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
           
        var data = new Object();

        if (req.body.TransactionIDSLP === '') {
            data = {
                TransDate : req.body.TransDate,
                NoReference : req.body.NoReference,
                'a.BUSS_CODE' : req.body.BUSS_CODE,
                CurrencyID : req.body.CurrencyID,
                Amount : req.body.Amount,
                'a.FileName' : req.body.FileName,
                MethodPayment : req.body.MethodPayment,
                BankFrom : req.body.BankFrom,
                BankTo : req.body.BankTo,
                Catatan : req.body.Catatan,
                'a.KodeNik' : req.body.KodeNik,
                KODE_KLSX : req.body.KODE_KLSX,
                'a.isValidate' : req.body.isValidate,
                isValidate2 : req.body.isValidate2,
                isValidate3 : req.body.isValidate3,
                'a.isDelete' : req.body.isDelete,
                'a.UPDT_DATE' : tgl,
                'a.UPDT_BYXX' : req.userID
            };
        } else {
            data = {
                TransDate : req.body.TransDate,
                NoReference : req.body.NoReference,
                'a.BUSS_CODE' : req.body.BUSS_CODE,
                CurrencyID : req.body.CurrencyID,
                Amount : req.body.Amount,
                'a.FileName' : req.body.FileName,
                MethodPayment : req.body.MethodPayment,
                TransactionIDSLP : req.body.TransactionIDSLP,
                BankFrom : req.body.BankFrom,
                BankTo : req.body.BankTo,
                Catatan : req.body.Catatan,
                'a.KodeNik' : req.body.KodeNik,
                KODE_KLSX : req.body.KODE_KLSX,
                'a.isValidate' : req.body.isValidate,
                isValidate2 : req.body.isValidate2,
                isValidate3 : req.body.isValidate3,
                'a.isDelete' : req.body.isDelete,
                'a.UPDT_DATE' : tgl,
                'a.UPDT_BYXX' : req.userID
            };
        }
        
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                // update item transaction
                sql = "update trans_item set KodeNik ='" + req.body.KodeNik + "', KODE_KLSX = '" + req.body.KODE_KLSX + "', BUSS_CODE = '" + req.body.BUSS_CODE + "', UPDT_BYXX = '" + req.userID + "', UPDT_DATE = '" + tgl + "' where TransNumber = '" + req.body.transNumber + "'";

                db.query(sql, (err, result) => {
                    // update Donatur is verified
                    sql = 'UPDATE `tb11_mzjb` SET Status = "4", UPDT_BYXX = "' + req.userID + '", UPDT_DATE = "' + tgl + '" WHERE NO_ID = "' + req.body.DonaturID + '" And Status <> "4"';

                    db.query(sql, (err, result) => {
                        // update tabel mutasi - TransNumber (link ke tabel Transaksi Donatur)
                        if (req.body.isValidate === '1') {
                            sql = 'UPDATE `tblMutasi` SET TransNumber = "' + req.body.transNumber + '", UPDT_BYXX = "' + req.userID + '", UPDT_DATE = "' + tgl + '" WHERE id = ' + req.body.idMutasi;
    
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
            UPDT_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
        var authPrnt = req.AUTH_PRNT;

        var id = req.params.id;

        var sql = 'SELECT a.*, CONCAT(a.DonaturID, " - ", b.NAMA) As Donatur2, b.NAMA, b.ALMT_XXX1 As Alamat, e.CODD_DESC As Pekerjaan, DATE_FORMAT(a.TransDate, "%e-%b-%Y") As TglFormat, IFNULL(f.CHKX_CASH, "") As CHKX_CASH, c.Tertanda, c.Website, c.NAMA_UNIT, c.Alamat As AlamatUnit, c.Email, c.SK_Menkumham, c.Hotline, c.FileName As FileNameUnit, h.groupID As KODE_KLSX, i.StatusKry, j.CODD_DESC As MataUang FROM trans_donatur a LEFT JOIN tb11_mzjb b ON a.DonaturID = b.NO_ID left join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.Pekerjaan = e.CODD_VALU And e.CODD_FLNM = "PEKERJAAN" left join tb02_bank f on a.MethodPayment = f.KODE_BANK And f.KODE_FLNM = "TYPE_BYRX" And f.BUSS_CODE = a.BUSS_CODE left join vfirst_relawandet h on a.KodeNik = h.RelawanID left join tb21_empl i on a.KodeNik = i.KodeNik left join tb00_basx j on a.CurrencyID = j.CODD_VALU And j.CODD_FLNM = "CURR_MNYX" WHERE a.id = "'+ id +'" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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
                    obj['AUTH_PRNT'] = authPrnt;
                    obj['TYPE_PRSON'] = req.TYPE_PRSON0;
                    obj['TypeRelawan'] = req.TypeRelawan0;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getTransactionsFilter = function(req, res) {
        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;

        var sql = "select d.NAMA_UNIT, c.CODD_DESC As Channel, SUM(a.Amount) As Total FROM trans_donatur a inner join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_basx c on b.Channel = c.CODD_VALU And c.CODD_FLNM = 'CHANNEL_DONATUR' inner join tb00_unit d on b.BUSS_CODE = d.KODE_UNIT WHERE a.isValidate = '1' And DATE_FORMAT(a.TransDate, '%Y-%m-%d') between '" + tgl1 + "' and '" + tgl2 + "' And d.KODE_UNIT = '" + req.BUSS_CODE0 + "' group by d.NAMA_UNIT, c.CODD_DESC";
    
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

    getTransactionsPerChannel = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;

        var sql = "select DATE_FORMAT(a.TransDate, '%Y%m') As YearMonth, MONTHNAME(a.TransDate) As Bulan, c.CODD_DESC As Channel, f.CODD_DESC As Department, SUM(a.Amount) As Total, COUNT(DISTINCT b.NO_ID) As JumlahDonatur, COUNT(a.TransNumber) As JumlahTransaksi FROM trans_donatur a inner join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_basx c on b.Channel = c.CODD_VALU And c.CODD_FLNM = 'CHANNEL_DONATUR' inner join tb00_unit d on a.BUSS_CODE = d.KODE_UNIT left join tb21_empl e on a.KodeNik = e.KodeNik left join tb00_basx f on e.DepartmentID = f.CODD_VALU And f.CODD_FLNM = 'DEPARTMENT' WHERE a.isValidate = '1' And DATE_FORMAT(a.TransDate, '%Y-%m-%d') between '" + tgl1 + "' and '" + tgl2 + "' And d.KODE_URUT like '" + req.KODE_URUT0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate, '%Y%m') DESC, c.CODD_DESC, f.CODD_DESC";
    
        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
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
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var sql = 'UPDATE tb52_slpc a INNER JOIN tb52_slpa b ON a.transNumber = b.transNumber INNER JOIN tb00_unit c ON b.unit = c.KODE_UNIT INNER JOIN tb11_mzjb d ON a.donaturID = d.NO_ID SET a.status = "' + status + '", a.UPDT_BYXX = "' + req.userID + '", a.UPDT_DATE = "' + tgl + '" WHERE a.transNumber = "' + transNumber + '" And CONCAT(IFNULL(d.CodeCountryHP, ""), d.NoHP) = "' + noHP + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        
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

    // get transaction relasi
    getTransRelation = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve
        var authPrnt = req.AUTH_PRNT;

        var isValid = req.params.isValid;
        var sql = '';

        if (isValid === '0') {
            isValid = '0",null';
        } else if (isValid === '1') {
            isValid = '1"';
        }
        
        sql = 'SELECT a.*, b.NAMA, CONCAT(b.NO_ID, " - ", b.NAMA) As Donatur2, DATE_FORMAT(a.TransDate, "%Y%m%d") As TransDateFormat, DATE_FORMAT(a.TransDate, "%d/%m/%Y") As TglFormat, d.CODD_DESC As Channel, e.TahunDonasi, b.TITLE, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHP2, f.CODD_DESC As ProgDonatur, g.Department, h.NAMA_BANK As Bank, i.CODD_DESC As SegmenProfil, k.NamaKry As NamaRelawan, CONCAT(IFNULL(b.CodeCountryHP, ""), b.NoHP) As NoHPRelawan, c.NAMA_UNIT, l.Amount_item As Amount FROM trans_donatur a left join tb11_mzjb b on a.donaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = "CHANNEL_DONATUR" left join vfirst_transaction e on a.DonaturID = e.DonaturID  left join vdepartment g on a.CRTX_BYXX = g.USER_IDXX left join tb02_bank h on a.BankTo = h.KODE_BANK And h.KODE_FLNM = "KASX_BANK" left join tb00_basx i on b.SEGMX_PROF = i.CODD_VALU And i.CODD_FLNM = "SEGMENT_PROFILING" inner join tb21_empl k on a.KodeNik = k.KodeNik inner join trans_item l on a.TransNumber = l.TransNumber left join tb00_basx f on l.ProgDonatur = f.CODD_VALU And l.BUSS_CODE = f.CODD_VARC And f.CODD_FLNM = "PROGRAM_DONATUR" WHERE a.isValidate in ("' + isValid + ') And (a.isDelete <> "1" OR a.isDelete IS NULL) And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';
        
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
                    obj['AUTH_PRNT'] = authPrnt;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getSummaryTransaction = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, IFNULL(d.CODD_DESC, '') As Channel, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi, ROUND(SUM(a.Amount)/COUNT(distinct a.DonaturID),2) As SendGiving, (COUNT(distinct a.DonaturID)/MAX(GetDaysOfMonth(a.TransDate))) As AverageDonatur, (COUNT(a.Amount)/MAX(GetDaysOfMonth(a.TransDate))) As AverageTransaksi, ROUND(SUM(a.Amount)/MAX(GetDaysOfMonth(a.TransDate)), 2) As AverageDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = 'CHANNEL_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And d.CODD_VALU is not null And (a.isDelete <> '1' OR a.isDelete IS NULL)group by DATE_FORMAT(a.TransDate,'%Y-%m') Desc, d.CODD_DESC";

        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    getSummaryTransactionPerWeek = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var sql = "select CONCAT(DATE_FORMAT(a.TransDate,'%Y-%m'),' ',WEEK(TransDate, 3) - " + 
        "WEEK(a.TransDate - INTERVAL DAY(a.TransDate)-1 DAY, 3) + 1) As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate),' Week ',WEEK(a.TransDate, 3) - WEEK(a.TransDate - INTERVAL DAY(a.TransDate)-1 DAY, 3) + 1) As BulanTahun, IFNULL(d.CODD_DESC, '') As Channel, GetDaysOfMonth(a.TransDate) As JumlahHari, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi, ROUND(SUM(a.Amount)/COUNT(distinct a.DonaturID),2) As SendGiving FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on b.Channel = d.CODD_VALU And d.CODD_FLNM = 'CHANNEL_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And d.CODD_VALU is not null group by CONCAT(DATE_FORMAT(a.TransDate,'%Y-%m'),' ',WEEK(TransDate, 3) - " + "WEEK(a.TransDate - INTERVAL DAY(a.TransDate)-1 DAY, 3) + 1) Desc, d.CODD_DESC";

        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    getSummaryTransactionPerProgram = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;

        var period = '%';
        if (req.params.period !== undefined && req.params.period !== 'all') {
            period = req.params.period;
        }

        var sql = "select d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by d.CODD_DESC";

        if (typePerson === '1') {
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = "select d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And h.KodeKelurahan like '" + req.KODE_AREA0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by d.CODD_DESC";

                    break;
                case '05' :  // Bendahara
                    sql = "select d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And a.KODE_KLSX = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by d.CODD_DESC";

                    break;
                case '06' : 
                    sql = "select d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' inner join tb01_lgxh g on a.KodeNik = g.NO_ID WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And UPPER(g.USER_IDXX) = '" + req.userID.toUpperCase() + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by d.CODD_DESC";
            }
        }

        /* if (req.params.period === 'all') {
            sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate,'%Y-%m') like '" + period + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m'), d.CODD_DESC, e.CODD_DESC";
        } */

        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    getSummaryTransactionPerProgram2 = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;

        var period = '%';
        if (req.params.period !== undefined && req.params.period !== 'all') {
            period = req.params.period;
        }

        var sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m') Desc, d.CODD_DESC, e.CODD_DESC";

        if (typePerson === '1') {
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And h.KodeKelurahan like '" + req.KODE_AREA0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m') Desc, d.CODD_DESC, e.CODD_DESC";

                    break;
                case '05' :  // Bendahara
                    sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And a.KODE_KLSX = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m') Desc, d.CODD_DESC, e.CODD_DESC";

                    break;
                case '06' : 
                    sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' inner join tb01_lgxh g on a.KodeNik = g.NO_ID WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And UPPER(g.USER_IDXX) = '" + req.userID.toUpperCase() + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m') Desc, d.CODD_DESC, e.CODD_DESC";
            }
        }

        /* if (req.params.period === 'all') {
            sql = "select DATE_FORMAT(a.TransDate,'%Y-%m') As TahunBulan, CONCAT(MONTHNAME(a.TransDate),' ',YEAR(a.TransDate)) As BulanTahun, d.CODD_DESC As ProgramDonatur, IFNULL(e.CODD_DESC, '') As SegmenProfil, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(f.Amount_item) As JumlahTransaksi, SUM(f.Amount_item) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join trans_item f on a.TransNumber = f.TransNumber left join tb00_basx d on f.ProgDonatur = d.CODD_VALU And f.BUSS_CODE = d.CODD_VARC And d.CODD_FLNM = 'PROGRAM_DONATUR' WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And f.ProgDonatur is not null And DATE_FORMAT(a.TransDate,'%Y-%m') like '" + period + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by DATE_FORMAT(a.TransDate,'%Y-%m'), d.CODD_DESC, e.CODD_DESC";
        } */

        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    // get Summary per Area
    getSummaryTransactionPerGroup = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;

       /*  var period = '%';
        if (req.params.period !== undefined && req.params.period !== 'all') {
            period = req.params.period;
        } */

        var sql = "select * from trans_donatur where 0";

        if (typePerson === '1') {
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = "select Case '" + typeRelawan + "' When '03' Then CONCAT('Kelurahan ', i.AREA_DESC) When '04' Then CONCAT('Group ', h.NAMA_GRPX) When '02' Then CONCAT('Kecamatan ', i.KECX_DESC) When '01' Then i.KOTA_DESC Else 'XXXX' End As NAMA_GRPX, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX left join tb20_area i on h.KodeKelurahan = i.AREA_IDXX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And h.KodeKelurahan like '" + req.KODE_AREA0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by Case '" + typeRelawan + "' When '03' Then CONCAT('Kelurahan ', i.AREA_DESC) When '04' Then CONCAT('Group ', h.NAMA_GRPX) When '02' Then CONCAT('Kecamatan ', i.KECX_DESC) When '01' Then i.KOTA_DESC Else 'XXXX' End";

                    break;
                case '05' :  // bendahara
                    sql = "select h.NamaKry As NAMA_GRPX, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet f on a.KodeNik = f.RelawanID left join tb21_empl h on a.KodeNik = h.KodeNik WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And f.groupID = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by h.NamaKry";

                    break;
                case '06' :
                    sql = "select b.NAMA As NAMA_GRPX, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' inner join tb01_lgxh g on a.KodeNik = g.NO_ID left join vfirst_relawandet h on a.KodeNik = h.RelawanID left join tb21_empl j on a.KodeNik = j.KodeNik WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And UPPER(g.USER_IDXX) = '" + req.userID.toUpperCase() + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by b.NAMA";
            }
        }

        if (typePerson === '4') {  // 4: Official setingkat Relawan Korwil ('32')
            sql = "select Case When h.IDXX_GRPX Is Null Then 'OFISIAL' Else i.KOTA_DESC End As NAMA_GRPX, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX left join tb20_area i on h.KodeKelurahan = i.AREA_IDXX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And (h.KodeKelurahan like '32%' OR h.IDXX_GRPX is null) And (a.isDelete <> '1' OR a.isDelete IS NULL) group by i.KOTA_DESC";
        }
        
        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    getDetTransactionsPerGroup = (request, response) => {
        var authPrnt = request.AUTH_PRNT;

        var tgl1 = request.params.tgl1;
        var tgl2 = request.params.tgl2;
        var typePerson = request.TYPE_PRSON0;
        var typeRelawan = request.TypeRelawan0;
        var kodeArea = request.KODE_AREA0;

        var sql = '';

        if (typePerson === '1') {    // 1: Relawan
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = 'select e.KOTA_DESC, e.KECX_DESC, e.KECX_IDXX, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry, a.Amount, g.CODD_VARC As CurrencySimbol FROM trans_donatur a inner join tb21_empl b on a.KodeNik = b.KodeNik inner join vfirst_relawandet c on b.KodeNik = c.RelawanID inner join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb20_area e on d.KodeKelurahan = e.AREA_IDXX inner join tb00_unit f on a.BUSS_CODE = f.KODE_UNIT left join tb00_basx g on a.CurrencyID = g.CODD_VALU And g.CODD_FLNM = "CURR_MNYX" left join tb00_unit h on a.BUSS_CODE = h.KODE_UNIT where h.KODE_URUT like "' + request.KODE_URUT0 + '%" And DATE_FORMAT(a.TransDate, "%Y%m%d") Between "' + tgl1 + '" And "' + tgl2 + '" And d.KodeKelurahan like "' + kodeArea + '%" And (a.isDelete <> "1" OR a.isDelete IS NULL)  order by e.KOTA_DESC, e.KECX_DESC, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry';

                    break;
                case '05' :    // 05: Bendahara
                    sql = 'select e.KOTA_DESC, e.KECX_DESC, e.KECX_IDXX, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry, a.Amount, g.CODD_VARC As CurrencySimbol from trans_donatur a inner join tb21_empl b on a.KodeNik = b.KodeNik inner join vfirst_relawandet c on b.KodeNik = c.RelawanID inner join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb20_area e on d.KodeKelurahan = e.AREA_IDXX inner join tb00_unit f on a.BUSS_CODE = f.KODE_UNIT left join tb00_basx g on a.CurrencyID = g.CODD_VALU And g.CODD_FLNM = "CURR_MNYX" left join tb00_unit h on a.BUSS_CODE = h.KODE_UNIT where h.KODE_URUT like "' + request.KODE_URUT0 + '%" And DATE_FORMAT(a.TransDate, "%Y%m%d") Between "' + tgl1 + '" And "' + tgl2 + '" And d.IDXX_GRPX = "' + request.groupID + '" And (a.isDelete <> "1" OR a.isDelete IS NULL) order by e.KOTA_DESC, e.KECX_DESC, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry';

                    break;
                case '06' :
                    sql = 'select e.KOTA_DESC, e.KECX_DESC, e.KECX_IDXX, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry, a.Amount, h.CODD_VARC As CurrencySimbol from trans_donatur a inner join tb21_empl b on a.KodeNik = b.KodeNik inner join vfirst_relawandet c on b.KodeNik = c.RelawanID inner join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb20_area e on d.KodeKelurahan = e.AREA_IDXX inner join tb00_unit f on a.BUSS_CODE = f.KODE_UNIT inner join tb01_lgxh g on a.KodeNik = g.NO_ID left join tb00_basx h on a.CurrencyID = h.CODD_VALU And h.CODD_FLNM = "CURR_MNYX" left join tb00_unit i on a.BUSS_CODE = i.KODE_UNIT where i.KODE_URUT like "' + request.KODE_URUT0 + '%" And DATE_FORMAT(a.TransDate, "%Y%m%d") Between "' + tgl1 + '" And "' + tgl2 + '" And UPPER(g.USER_IDXX) = "' + request.userID.toUpperCase() + '" And (a.isDelete <> "1" OR a.isDelete IS NULL) order by e.KOTA_DESC, e.KECX_DESC, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry';
            }
        } 

        if (typePerson === '4') {   // 4: Official setingkat Relawan Korwil ('32')
            sql = 'select e.KOTA_DESC, e.KECX_DESC, e.KECX_IDXX, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry, a.Amount, g.CODD_VARC As CurrencySimbol from trans_donatur a inner join tb21_empl b on a.KodeNik = b.KodeNik inner join vfirst_relawandet c on b.KodeNik = c.RelawanID inner join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb20_area e on d.KodeKelurahan = e.AREA_IDXX inner join tb00_unit f on a.BUSS_CODE = f.KODE_UNIT left join tb00_basx g on a.CurrencyID = g.CODD_VALU And g.CODD_FLNM = "CURR_MNYX" left join tb00_unit h on a.BUSS_CODE = h.KODE_UNIT where h.KODE_URUT like "' + request.KODE_URUT0 + '%" And DATE_FORMAT(a.TransDate, "%Y%m%d") Between "' + tgl1 + '" And "' + tgl2 + '" And d.KodeKelurahan like "32%" And (a.isDelete <> "1" OR a.isDelete IS NULL) order by e.KOTA_DESC, e.KECX_DESC, e.AREA_DESC, d.NAMA_GRPX, b.NamaKry';
        }

        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            response.send(output);
        });
    }

    // get Summary per Unit
    getSummaryTransactionPerUnit = function(req, res) {
        var authPrnt = req.AUTH_PRNT;

        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;

        var period = '%';
        if (req.params.period !== undefined && req.params.period !== 'all') {
            period = req.params.period;
        }

        var sql = "select * from trans_donatur where 0";

        if (typePerson === '1') {
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = "select c.NAMA_UNIT, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX left join tb20_area i on h.KodeKelurahan = i.AREA_IDXX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And h.KodeKelurahan like '" + req.KODE_AREA0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by c.NAMA_UNIT";

                    break;
                case '05' :   // Bendahara
                    sql = "select c.NAMA_UNIT, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet f on a.KodeNik = f.RelawanID WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And f.groupID = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by c.NAMA_UNIT";

                    break;
                case '06' :
                    sql = "select c.NAMA_UNIT, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet f on a.KodeNik = f.RelawanID WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And f.groupID = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL) group by c.NAMA_UNIT";
            }
        }

        if (typePerson === '4') {  // 4: Official setingkat Relawan Korda ('3275')
            sql = "select c.NAMA_UNIT, COUNT(distinct a.DonaturID) As JumlahDonatur, COUNT(a.Amount) As JumlahTransaksi, SUM(a.Amount) As JumlahDonasi FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx e on b.SEGMX_PROF = e.CODD_VALU And e.CODD_FLNM = 'SEGMENT_PROFILING' left join vfirst_relawandet g on a.KodeNik = g.RelawanID left join grpx_relx h on g.groupID = h.IDXX_GRPX left join tb20_area i on h.KodeKelurahan = i.AREA_IDXX WHERE c.KODE_URUT like '" + req.KODE_URUT0 +  "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And (h.KodeKelurahan like '3275%' OR h.IDXX_GRPX is null) And (a.isDelete <> '1' OR a.isDelete IS NULL) group by c.NAMA_UNIT";
        }
        
        db.query(sql, function(err, rows, fields) {
            var output = [];
    
            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key]; 
                    }

                    obj['AUTH_PRNT'] = authPrnt;
    
                    output.push(obj);
                })
            }
    
            res.send(output);
        });
    }

    // get Partner Transactions per period, not per month
    getPartnerTransactions = function(req, res) {
        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;

        // type badan : 4 (CHANNEL)
        var sql = 'select b.NAMA, a.Amount, DATE_FORMAT(a.TransDate, "%e-%b-%Y") As TglFormat from trans_donatur a inner join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit on a.BUSS_CODE = c.KODE_UNIT where DATE_FORMAT(a.TransDate, "%Y%m%d") Between "' + tgl1 + '" And "' + tgl2 + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And b.TypeBadan = "4" And (a.isDelete <> "1" OR a.isDelete IS NULL) order by a.TransDate Desc';
       
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    // summary transaction per period, not per month
    getSummaryTransactionPerMonth = function(req, res) {
        var tgl1 = req.params.tgl1;
        var tgl2 = req.params.tgl2;
        var typePerson = req.TYPE_PRSON0;
        var typeRelawan = req.TypeRelawan0;
        var sql = '';

        sql = "select SUM(a.Amount) As JumlahDonasi, SUM(Case a.isValidate When '1' Then a.Amount Else 0 End) As JumlahValidasi, SUM(Case d.CHKX_BANK When '1' Then a.Amount Else 0 End) As JumlahTransfer, SUM(Case d.CHKX_CASH When '1' Then a.Amount Else 0 End) As JumlahTunai FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb02_bank d on a.MethodPayment = d.KODE_BANK And d.KODE_FLNM = 'TYPE_BYRX' And a.BUSS_CODE = d.BUSS_CODE WHERE c.KODE_URUT like '" + req.KODE_URUT0 + "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 +   "' And (a.isDelete <> '1' OR a.isDelete IS NULL)";

        if (typePerson === '1') {
            switch(typeRelawan) {
                case '01' : case '02' : case '03' : case '04' :   // 04: Korra
                    sql = "select SUM(a.Amount) As JumlahDonasi, SUM(Case a.isValidate When '1' Then a.Amount Else 0 End) As JumlahValidasi, SUM(Case d.CHKX_BANK When '1' Then a.Amount Else 0 End) As JumlahTransfer, SUM(Case d.CHKX_CASH When '1' Then a.Amount Else 0 End) As JumlahTunai FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb02_bank d on a.MethodPayment = d.KODE_BANK And d.KODE_FLNM = 'TYPE_BYRX' And a.BUSS_CODE = d.BUSS_CODE left join vfirst_relawandet e on a.KodeNik = e.RelawanID left join grpx_relx f on e.groupID = f.IDXX_GRPX WHERE c.KODE_URUT like '" + req.KODE_URUT0 + "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 + "' And YEAR(a.TransDate) = YEAR(NOW()) And f.KodeKelurahan like '" + req.KODE_AREA0 + "%' And (a.isDelete <> '1' OR a.isDelete IS NULL)";

                    break;
                case '05' :  // Bendahara
                    sql = "select SUM(a.Amount) As JumlahDonasi, SUM(Case a.isValidate When '1' Then a.Amount Else 0 End) As JumlahValidasi, SUM(Case d.CHKX_BANK When '1' Then a.Amount Else 0 End) As JumlahTransfer, SUM(Case d.CHKX_CASH When '1' Then a.Amount Else 0 End) As JumlahTunai FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb02_bank d on a.MethodPayment = d.KODE_BANK And d.KODE_FLNM = 'TYPE_BYRX' And a.BUSS_CODE = d.BUSS_CODE left join vfirst_relawandet e on a.KodeNik = e.RelawanID WHERE c.KODE_URUT like '" + req.KODE_URUT0 + "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 + "' And e.groupID = '" + req.groupID + "' And (a.isDelete <> '1' OR a.isDelete IS NULL)";

                    break;
                case '06' :  // 06: Relawan
                    sql = "select SUM(a.Amount) As JumlahDonasi, SUM(Case a.isValidate When '1' Then a.Amount Else 0 End) As JumlahValidasi, SUM(Case d.CHKX_BANK When '1' Then a.Amount Else 0 End) As JumlahTransfer, SUM(Case d.CHKX_CASH When '1' Then a.Amount Else 0 End) As JumlahTunai FROM trans_donatur a left join tb11_mzjb b on a.DonaturID = b.NO_ID inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb02_bank d on a.MethodPayment = d.KODE_BANK And d.KODE_FLNM = 'TYPE_BYRX' And a.BUSS_CODE = d.BUSS_CODE inner join tb01_lgxh e on a.KodeNik = e.NO_ID WHERE c.KODE_URUT like '" + req.KODE_URUT0 + "%' And DATE_FORMAT(a.TransDate, '%Y%m%d') Between '" + tgl1 + "' And '" + tgl2 + "' And UPPER(e.USER_IDXX) = '" + req.userID.toUpperCase() + "' And (a.isDelete <> '1' OR a.isDelete IS NULL)";
            }
        }
        
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    saveGroup = function(req, res) {
        // check Access PROC_CODE 
       /*  if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        } */

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
        }

        var groupID;
        if (req.body.groupID === null || req.body.groupID === undefined) {
            groupID = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            groupID = req.body.groupID;
        }

        var sql = 'INSERT INTO grpx_relx SET ?';
        var data = {
            IDXX_GRPX : groupID,
            NAMA_GRPX : req.body.NAMA_GRPX,
            KodeKecamatan: req.body.KodeKecamatan,
            KodeKelurahan: req.body.KodeKelurahan,
            BUSS_CODE: req.BUSS_CODE0,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
                    groupID: groupID,
                    status: true
                });
            }
        });
    }

    getGroups = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve
        
        var qryCmd = '';
        var typeRelawan = request.TypeRelawan0;
        var typePerson = request.TYPE_PRSON0;

        if (request.params.bussCode === 'all') {
            qryCmd = "select a.*, c.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb20_area c on a.KodeKelurahan = c.AREA_IDXX where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.KODE_URUT";

            if (typePerson === '1') {  // 1: Relawan,  
                if (typeRelawan <= '04') { // 04: Korra
                    qryCmd = "select a.*, c.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb20_area c on a.KodeKelurahan = c.AREA_IDXX where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.KODE_URUT";
                }

                if (typeRelawan >= '05') {  // 05: Bendahara Group
                    qryCmd = "select a.*, c.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb20_area c on a.KodeKelurahan = c.AREA_IDXX where b.KODE_UNIT = '" + request.BUSS_CODE0 + "'";
                }
            }
        } else {
            qryCmd = "select a.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.KODE_URUT";

            if (typePerson === '1') { // 1: Relawan
                if (typeRelawan === '06') {  // 06: Relawan
                    qryCmd = "select a.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb01_lgxh c on b.KODE_UNIT = c.BUSS_CODE inner join vfirst_relawandet d on c.NO_ID = d.RelawanID And d.groupID = a.IDXX_GRPX  WHERE a.BUSS_CODE = '" + request.params.bussCode + "' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(c.USER_IDXX) = '" + request.userID.toUpperCase() + "'";
                }

                if (typeRelawan <= '04') {
                    qryCmd = "select a.*, c.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb20_area c on a.KodeKelurahan = c.AREA_IDXX where a.BUSS_CODE = '" + request.params.bussCode + "' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.KodeKelurahan like '" + request.KODE_AREA0 + "%'";
                }

                if (typeRelawan === '05') {  // 05: Bendahara Group
                    qryCmd = "select a.* from grpx_relx a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.BUSS_CODE = '" + request.params.bussCode + "' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.IDXX_GRPX = '" + request.groupID + "'";
                }
            }
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

    getGroup = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;   // IDXX_GRPX

        var sql = 'select a.*, c.KOTA_IDXX from `grpx_relx` a inner join tb00_unit b on a.BUSS_CODe = b.KODE_UNIT inner join tb20_area c on a.KodeKelurahan = c.AREA_IDXX where IDXX_GRPX = "' + id + '" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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

    updateGroup = function(req, res) {
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

        var sql = 'UPDATE grpx_relx a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.IDXX_GRPX = "' + id + '" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';

        var data = {
            NAMA_GRPX: req.body.NAMA_GRPX,
            BUSS_CODE: req.body.BUSS_CODE,
            KodeKecamatan: req.body.KodeKecamatan, 
            KodeKelurahan : req.body.KodeKelurahan,
            'a.UPDT_DATE' : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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

    getTransItems = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve
        
        var id = req.params.id;   // id: TransNumber
        
        var sql = 'select a.*, b.CODD_DESC As Program FROM trans_item a left join tb00_basx b on a.ProgDonatur = b.CODD_VALU And b.CODD_FLNM = "PROGRAM_DONATUR" And a.BUSS_CODE = b.CODD_VARC inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT where a.TransNumber = "' + id + '" And c.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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

    saveTransItem = function(req, res) {
        // check Access PROC_CODE 
        /* if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        } */

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
        }

        var sql = 'INSERT INTO trans_item SET ?';
        var data = {
            TransNumber : req.body.TransNumber,
            BUSS_CODE : req.body.BUSS_CODE,
            THNX_BUKU : req.body.THNX_BUKU,
            KodeNik : req.body.KodeNik,
            KODE_KLSX : req.body.KODE_KLSX,
            ProgDonatur : req.body.ProgDonatur,
            Amount_item : req.body.Amount_item,
            note : req.body.note,
            CRTX_DATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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

    saveTransItemArray = function(req, res) {
        // check Access PROC_CODE 
        /* if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        } */

        // get user Access
        var authAdd = req.AUTH_ADDX;

        if (authAdd === '0') {
            return res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });
        }

        var cntTransItems = req.body.cntTransItems;
        var sql = '';
        var tglNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var progDonaturs = [];
        progDonaturs = fncParseComma(req.body.ProgDonaturs);

        var amountItems = [];
        amountItems = fncParseComma(req.body.AmountItems);

        var notes = [];
        notes = fncParseComma(req.body.Notes);

        var sqlDelete = 'delete from trans_item where TransNumber = "' + req.body.TransNumber + '"';

        if (cntTransItems > 0) {
            var kelas = req.body.KODE_KLSX;
            if (kelas === null) {
                kelas = '';
            }

            sql = 'INSERT INTO trans_item (TransNumber, BUSS_CODE, THNX_BUKU, KodeNik, KODE_KLSX, ProgDonatur, Amount_item, note, CRTX_DATE, CRTX_BYXX) VALUES ';
            for(var i=0; i<cntTransItems; i++) {
                if (i === 0) {
                    sql += '("' + req.body.TransNumber + '","' + req.body.BUSS_CODE + '","' + req.body.THNX_BUKU + '","' + req.body.KodeNik + '","' + kelas + '","' + progDonaturs[i] + '",' + amountItems[i] + ',"' + notes[i] + '","' + tglNow + '","' + req.userID + '")';
                } else {
                    sql += ',("' + req.body.TransNumber + '","' + req.body.BUSS_CODE + '","' + req.body.THNX_BUKU + '","' + req.body.KodeNik + '","' + kelas + '","' + progDonaturs[i] + '",' + amountItems[i] + ',"' + notes[i] + '","' + tglNow + '","' + req.userID + '")';
                }
            }

            db.query(sqlDelete, (err, result) => {
                if (err) {
                    console.log('Error', err);
    
                    res.send({
                        status: false,
                        message: err.sqlMessage
                    });
                } else {
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
            });
        } else {
            res.send({
                status: true
            });
        }
    }

    deleteTransItem = function(req, res) {
        var id = req.body.id;
        var sql = "delete `trans_item` from `trans_item` inner join tb00_unit on trans_item.BUSS_CODE = tb00_unit.KODE_UNIT where trans_item.id = " + id + " And tb00_unit.KODE_URUT like '" + req.KODE_URUT0 + "%'";

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

    // get Detail Donaturs dari Group
    getGroupDonaturs = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var id = request.params.id;  // IDXX_GRPX
        
        var qryCmd = "select e.*, b.NAMA_GRPX from tb11_mzjb e left join tblRelawanDet c on e.RelawanID = c.RelawanID left join grpx_relx b on c.IDXX_GRPX = b.IDXX_GRPX left join tb00_unit d on b.BUSS_CODE = d.KODE_UNIT where d.KODE_URUT like '" + request.KODE_URUT0 + "%' And c.IDXX_GRPX = '" + id + "'";

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

    /* paymentTransaction = (request, response) => {
        var data = {
            TransNumber : transNumber,
            TransDate : req.body.TransDate,
            BUSS_CODE : req.body.BUSS_CODE
        }

        db.query(sql, data, (err, result) => {

        });
    } */

    verifyTrans = function(req, res) {
        var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
        var arrayLength = selectedIds.length;

        var sql = 'UPDATE trans_donatur a inner join tb02_bank b on a.MethodPayment = b.KODE_BANK And a.BUSS_CODE = b.BUSS_CODE inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT SET isValidate3 = Case a.isValidate2 When "1" Then "1" Else "0" End, a.isValidate2 = Case a.isValidate When "1" Then "1" Else "0" End, a.isValidate = "1", a.UPDT_DATE = "' + tgl + '", a.UPDT_BYXX = "' + req.userID + '" WHERE c.KODE_URUT like "' + req.KODE_URUT0 + '%" And (a.isValidate = "0" Or (a.isValidate = "1" And a.isValidate2 = "0") Or (a.isValidate2 = "1" And a.isValidate3 = "0")) And b.CHKX_CASH = "1" And a.id in ("';
        
        var sqlListId = '';
        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                    sqlListId += selectedIds[i] + '"' ;
                } else {
                    sqlListId += ',"' + selectedIds[i] + '"';
                }
            } 
    
            sqlListId += ')';

            sql += sqlListId;
            
            db.query(sql, (err, result) => {
                if (err) {
                    console.log('Error', err);

                    res.send({
                        status: false,
                        message: err.sqlMessage
                    });
                } else {
                    // retrieve transaction based id to create transaction SLP
                    sql = 'select a.*, d.CODD_VARC As Simbol, c.NAMA_UNIT, c.Tertanda, c.Website from trans_donatur a inner join tb02_bank b on a.MethodPayment = b.KODE_BANK And a.BUSS_CODE = b.BUSS_CODE inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT left join tb00_basx d on a.CurrencyID = d.CODD_VALU And d.CODD_FLNM = "CURR_MNYX" where a.isValidate = "1" And a.isValidate2 = "0" And b.CHKX_CASH = "1" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And a.id in ("' + sqlListId;
                    
                    db.query(sql, function(err, rows, fields) {
                        sql = 'INSERT INTO tb52_slpa (transNumber, tglProses, typeProgram, status, tahunBuku, Message, unit, CRTX_DATE, CRTX_BYXX) VALUES ';
                        if (rows.length > 0) {
                            var transNumber;
                            if (req.body.transNumber === null || req.body.transNumber === undefined) {
                                transNumber = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                                    req.body.NextSequenceFormat);
                            } else {
                                transNumber = req.body.transNumber;
                            }

                            var nextSequence = parseInt(transNumber.substring(transNumber.length-6,transNumber.length));
                            var nextSequenceFormat;
                            var bussCode = '';

                            rows.forEach((item, index) => {
                                var message = req.body.message;
                                message = message.split('[Amount]').join(item.Amount);
                                message = message.split('[TransDate]').join(moment(item.TransDate).format('DD-MMM-YYYY'));
                                message = message.split('[Currency]').join(item.Simbol);
                                message = message.split('[NamaUnit]').join(item.NAMA_UNIT);
                                message = message.split('[Tertanda]').join(item.Tertanda);
                                message = message.split('[Website]').join(item.Website);
                                message = message.split('"').join("'");

                                if (index === 0) {
                                    sql += '("' + transNumber + '", "' + tgl + '", "' + req.body.typeProgram + '", "0", "' + req.body.  tahunBuku + '", "' + message + '", "' + item.BUSS_CODE + '", "' + tgl + '", "' + req.userID + '")';

                                    nextSequenceFormat = nextSequence.toString().padStart(6, '0');
                                } else {
                                    nextSequence = nextSequence + 1;
                                    nextSequenceFormat = nextSequence.toString().padStart(6, '0');

                                    transNumber = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                                        nextSequenceFormat);

                                    sql += ',("' + transNumber + '", "' + tgl + '", "' + req.body.typeProgram + '", "0", "' + req.body.  tahunBuku + '", "' + message + '", "' + item.BUSS_CODE + '", "' + tgl + '", "' + req.userID + '")';
                                }

                                bussCode = item.BUSS_CODE;
                            });

                            db.query(sql, (err, result) => {
                                if (err) {
                                    console.log('Error', err);
                
                                    res.send({
                                        status: false,
                                        message: err.sqlMessage
                                    });
                                } else {
                                    sql = "update tblsequence set NOXX_URUT = '" + nextSequenceFormat + "', TGLX_PROC = '" + tgl + "' where Initial = '" + req.body.Initial + "' And BUSS_CODE = '" + bussCode + "' And Tahun = '" + req.body.Tahun + "'";

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
                            });
                        } else {
                            res.send({
                                status: true
                            });
                        }
                    });
                }
            });
        } else {
            res.send({
                status: true
            });
        }
    }

    getTransCash = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);
        var arrayLength = selectedIds.length;

        var sql = 'select a.*, c.NAMA_UNIT from trans_donatur a inner join tb02_bank b on a.MethodPayment = b.KODE_BANK And a.BUSS_CODE = b.BUSS_CODE inner join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT where (a.isValidate = "0" Or (a.isValidate = "1" And a.isValidate2 = "0") Or (a.isValidate2 = "1" And a.isValidate3 = "0")) And c.KODE_URUT like "' + req.KODE_URUT0 + '%" And b.CHKX_CASH = "1" And a.id in ("';

        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                    sql += selectedIds[i] + '"' ;
                } else {
                    sql += ',"' + selectedIds[i] + '"';
                }
            } 

            sql += ')';

            db.query(sql, function(err, rows, fields) {
                res.send({
                    status: true,
                    jumlah: rows.length,
                    data: rows
                });
            });
        } else {
            res.send({
                status: true,
                jumlah: 0
            });
        }

    }
}