import  db from './../../koneksi.js';
import moment from 'moment';
import { generateAutonumber } from './../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Karyawan {
    saveKaryawan = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var kodeNik;
        if (req.body.KodeNik === null || req.body.KodeNik === undefined) {
            kodeNik = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            kodeNik = req.body.KodeNik;
        }

        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var sql = 'INSERT INTO tb21_empl SET ?';
        var data = {
            KodeNik : kodeNik,
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            Title : req.body.Title,
            NICK_NAME : req.body.NICK_NAME,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            AlamatDomisili : req.body.AlamatDomisili,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            BUSS_CODE : bussCode,
            NoKTP : req.body.NoKTP,
            StatusAktif : '1',
            StatusKawin : req.body.StatusKawin,
            TglMasuk : req.body.TglMasuk,
            GolDarah : req.body.GolDarah,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TypeRelawan : req.body.TypeRelawan,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            StatusKry : req.body.StatusKry,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };

        var sqlDelete = 'DELETE FROM tb21_empl WHERE KodeNik = "' + data.KodeNik + '"';
        
        // execute query Delete
        db.query(sqlDelete, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {
                // execute query Save
                db.query(sql, data, (err2, result2) => {
                    if (err2) {
                        console.log('Error', err2);

                        res.send({
                            status: false,
                            message: err2.sqlMessage
                        });
                    } else {
                        if (req.body.IDXX_GRPX !== '' && req.body.IDXX_GRPX !== null && req.body.IDXX_GRPX !== undefined) {
                            // hapus di tabel relawan detail
                            sql = 'delete from tblRelawanDet where RelawanID = "' + kodeNik + '" And prime = "1"';
                            db.query(sql, (err2, result2) => {
                                // insert to tabel relawan detail
                                var tglNow = moment(new Date()).format('YYYY-MM-DD');

                                sql = 'insert into tblRelawanDet (RelawanID, IDXX_GRPX, CRTX_BYXX, CRTX_DATE, prime) values ("' + kodeNik + '", "' + req.body.IDXX_GRPX + '", "' + req.userID + '", "' + tglNow + '", "1")';

                                db.query(sql, (err2, result2) => {
                                    res.send({
                                        status: true
                                    });
                                });
                            });
                        } else {
                            res.send({
                                status: true
                            });
                        }
                    }
                });
            }
        });
    }

    saveKaryawanProfile = function(req, res) {
        var kodeNik;
        if (req.body.KodeNik === null || req.body.KodeNik === undefined) {
            kodeNik = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            kodeNik = req.body.KodeNik;
        }

        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var sql = 'INSERT INTO tb21_empl SET ?';
        var data = {
            KodeNik : kodeNik,
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            NICK_NAME : req.body.NICK_NAME,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            AlamatDomisili : req.body.AlamatDomisili,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            BUSS_CODE : bussCode,
            NoKTP : req.body.NoKTP,
            StatusAktif : '1',
            StatusKawin : req.body.StatusKawin,
            TglMasuk : req.body.TglMasuk,
            GolDarah : req.body.GolDarah,
            Title : req.body.Title,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TypeRelawan : req.body.TypeRelawan,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            DepartmentID : req.body.DepartmentID,
            StatusKry : req.body.StatusKry,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };

        var sqlDelete = 'DELETE FROM tb21_empl WHERE KodeNik = "' + data.KodeNik + '"';
        
        // execute query Delete
        db.query(sqlDelete, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {
                // execute query Save
                db.query(sql, data, (err2, result2) => {
                    if (err2) {
                        console.log('Error', err2);

                        res.send({
                            status: false,
                            message: err2.sqlMessage
                        });
                    } else {
                        // update tabel tb01_lgxh, field NO_ID
                        sql = 'update tb01_lgxh set NO_ID = "' + kodeNik + '" where USER_IDXX = "' + req.userID + '"';
                        db.query(sql, (err2, result2) => {
                            res.send({
                                status: true,
                                NO_ID: kodeNik
                            });
                        });
                    }
                });
            }
        });
    }

    saveKaryawanPrsh = function(req, res) {
        var kodeNik;
        if (req.body.KodeNik === null || req.body.KodeNik === undefined) {
            kodeNik = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            kodeNik = req.body.KodeNik;
        }

        var sql = 'INSERT INTO tb21_empx SET ?';
        var data = {
            KodeNik : kodeNik,
            StatusKry : req.body.StatusKry,
            NPWP : req.body.NPWP,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };
    
        var sqlDelete = 'DELETE FROM tb21_empx WHERE KodeNik = "' + data.KodeNik + '"';
        
        // execute query Delete
        db.query(sqlDelete, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {

                // execute query Save
                db.query(sql, data, (err2, result2) => {
                    if (err2) {
                        console.log('Error', err2);
                    } else {
                        res.send({
                            status: true
                        });
                    }
                });
            }
        });
    }

    getKaryawan = function(req, res) {
        // get user Access
        var authEdit = req.AUTH_EDIT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var nik = req.params.id;
        var sql = 'SELECT a.*, b.NAMA_UNIT, c.groupID As IDXX_GRPX, d.CODD_DESC As TypeRelawanLbl, f.* FROM tb21_empl a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT LEFT JOIN vfirst_relawandet c ON a.KodeNik = c.RelawanID left join tb00_basx d on a.TypeRelawan = d.CODD_VALU And d.CODD_FLNM = "TYPE_RELAWAN" left join grpx_relx e on c.groupID = e.IDXX_GRPX left join tb20_area f on e.KodeKelurahan = f.AREA_IDXX WHERE a.KodeNik = "'+ nik +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" ';
        
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

    updateKaryawan = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }

        var id = req.body.id;  // id = nik
        var sql = 'UPDATE `tb21_empl` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.KodeNik = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" ';
        var data = {
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            BUSS_CODE : bussCode,
            NICK_NAME : req.body.NICK_NAME,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            AlamatDomisili : req.body.AlamatDomisili,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            'a.email' : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            NoKTP : req.body.NoKTP,
            StatusAktif : '1',
            StatusKawin : req.body.StatusKawin,
            StatusKry : req.body.StatusKry,
            TglMasuk : req.body.TglMasuk,
            GolDarah : req.body.GolDarah,
            Title : req.body.Title,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TypeRelawan : req.body.TypeRelawan,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
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
                if (req.body.IDXX_GRPX !== '' && req.body.IDXX_GRPX !== null && req.body.IDXX_GRPX !== undefined) {
                    // hapus di tabel relawan detail
                    sql = 'delete from tblRelawanDet where RelawanID = "' + id + '" And prime = "1"';
                    db.query(sql, (err2, result2) => {
                        // insert to tabel relawan detail
                        var tglNow = moment(new Date()).format('YYYY-MM-DD');

                        sql = 'insert into tblRelawanDet (RelawanID, IDXX_GRPX, CRTX_BYXX, CRTX_DATE, prime) values ("' + id + '", "' + req.body.IDXX_GRPX + '", "' + req.userID + '", "' + tglNow + '", "1")';
                        
                        db.query(sql, (err2, result2) => {
                            res.send({
                                status: true
                            });
                        });
                    });
                } else if (req.body.IDXX_GRPX === '') {
                    // hapus di tabel relawan detail
                    sql = 'delete from tblRelawanDet where RelawanID = "' + id + '"';
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
            }
        });
    }

    updateKaryawanProfile = function(req, res) {
        var bussCode;
        if (req.body.BUSS_CODE === null || req.body.BUSS_CODE === undefined) {
            bussCode = req.BUSS_CODE0;
        } else {
            bussCode = req.body.BUSS_CODE;
        }
        
        var sql = 'UPDATE `tb21_empl` a INNER JOIN tb01_lgxh b ON a.KodeNik = b.NO_ID SET ? WHERE UPPER(b.USER_IDXX) = "' + req.userID.toUpperCase() + '"';
        
        var data = {
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            NICK_NAME : req.body.NICK_NAME,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            AlamatDomisili : req.body.AlamatDomisili,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            'a.email' : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            'a.BUSS_CODE' : bussCode,
            NoKTP : req.body.NoKTP,
            StatusAktif : '1',
            StatusKawin : req.body.StatusKawin, 
            TglMasuk : req.body.TglMasuk,
            GolDarah : req.body.GolDarah,
            Title : req.body.Title,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            CodeCountryHPPIC : req.body.CodeCountryHPPIC,
            EmailPIC: req.body.EmailPIC,
            TypeRelawan : req.body.TypeRelawan,
            Pendidikan : req.body.Pendidikan,
            Pekerjaan : req.body.Pekerjaan,
            DepartmentID : req.body.DepartmentID,
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

    getProfileKaryawan = function(req, res) {
        var sql = 'SELECT a.*, c.groupID FROM tb21_empl a INNER JOIN tb01_lgxh b ON b.NO_ID = a.KodeNik LEFT JOIN vfirst_relawandet c on a.KodeNik = c.RelawanID WHERE UPPER(b.USER_IDXX) = "'+ req.userID.toUpperCase() +'" ';
        
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    getEmployees = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var status = request.params.status;  // Status karyawan
        var typeRelawan = request.TypeRelawan0;
        var typePerson = request.TYPE_PRSON0;

        var qryCmd = '';
        if (status === 'all') {
            qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
            "CASE a.StatusAktif " +
                "WHEN '1' THEN 'ACTIVE' " +
                "ELSE 'NOT ACTIVE' " +
            "END As StatusAktif2, b.KODE_UNIT, SUBSTRING(a.Alamat1, 1, 20) As Alamat, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, c.CODD_DESC As TypeRelawan " + 
            "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join tb00_basx c on a.TypeRelawan = c.CODD_VALU And c.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_UNIT = '" + request.BUSS_CODE0 + "' order by a.NamaKry";

            if (typePerson === '1') {  // 1: Relawan
                if (typeRelawan === '06') {  // typeRelawan 06: Relawan
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                        "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                        "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.NAMA_GRPX, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, f.CODD_DESC As TypeRelawan " + 
                        "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb01_lgxh e on a.KodeNik = e.NO_ID left join tb00_basx f on a.TypeRelawan = f.CODD_VALU And f.CODD_FLNM = 'TYPE_RELAWAN' WHERE b.KODE_UNIT = '" + request.BUSS_CODE0 + "' And UPPER(e.USER_IDXX) = '" + request.userID.toUpperCase() + "' And a.StatusKry = '5' order by a.NamaKry"; 
                }

                if (typeRelawan === '05') {  // typePerson 1: Relawan, typeRelawan 05: Bendahara Group
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                    "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                    "END As StatusAktif2, b.KODE_UNIT, SUBSTRING(a.Alamat1, 1, 20) As Alamat, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.CODD_DESC As TypeRelawan " + 
                    "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawandet c on a.KodeNik = c.RelawanID left join tb00_basx d on a.TypeRelawan = d.CODD_VALU And d.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_UNIT like '" + request.BUSS_CODE0 + "' And c.groupID = '" + request.groupID + "' And a.StatusKry = '5' order by a.NamaKry";
                }

                if (typeRelawan <= '04') {  // typePerson 1: Relawan, typeRelawan 04: Korra
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                    "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                    "END As StatusAktif2, b.KODE_UNIT, SUBSTRING(a.Alamat1, 1, 20) As Alamat, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, e.CODD_DESC As TypeRelawan, d.KODE_URUT As KodeUrutGroup " + 
                    "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawandet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX left join tb00_basx e on a.TypeRelawan = e.CODD_VALU And e.CODD_FLNM = 'TYPE_RELAWAN' where (b.KODE_UNIT = '" + request.BUSS_CODE0 + "' Or (d.KODE_URUT Is Not Null And d.KODE_URUT like '" + request.KODE_URUT_GROUP0 + "%')) And d.KodeKelurahan like '" + request.KODE_AREA0 + "%' And a.StatusKry = '5' order by d.KODE_URUT, a.NamaKry";
                }
            }

            if (typePerson === '4') {   // 4: Offisial
                qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                "CASE a.StatusAktif " +
                    "WHEN '1' THEN 'ACTIVE' " +
                    "ELSE 'NOT ACTIVE' " +
                "END As StatusAktif2, b.KODE_UNIT, SUBSTRING(a.Alamat1, 1, 20) As Alamat, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, IFNULL(c.groupID, '') As groupID, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, d.CODD_DESC As TypeRelawan " + 
                "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx e on c.groupId = e.IDXX_GRPX left join tb00_basx d on a.TypeRelawan = d.CODD_VALU And d.CODD_FLNM = 'TYPE_RELAWAN' where (b.KODE_UNIT = '" + request.BUSS_CODE0 + "' Or (e.KODE_URUT Is Not Null And e.KODE_URUT like '" + request.KODE_URUT_GROUP0 + "%')) order by a.NamaKry";
            }
        } else {
            qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
            "CASE a.StatusAktif " +
                "WHEN '1' THEN 'ACTIVE' " +
                "ELSE 'NOT ACTIVE' " +
            "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.NAMA_GRPX, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, e.CODD_DESC As TypeRelawan " + 
            "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX left join tb00_basx e on a.TypeRelawan = e.CODD_VALU And e.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' order by a.NamaKry";

            if (typePerson === '1') {  // 1: Relawan
                if (typeRelawan === '06') {  // typePerson 1: Relawan, typeRelawan 06: Relawan
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                        "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                        "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.NAMA_GRPX, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, f.CODD_DESC As TypeRelawan " + 
                        "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX inner join tb01_lgxh e on a.KodeNik = e.NO_ID left join tb00_basx f on a.TypeRelawan = f.CODD_VALU And f.CODD_FLNM = 'TYPE_RELAWAN' WHERE b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' And UPPER(e.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by a.NamaKry";
                }

                if (typeRelawan === '05') {  // typePerson 1: Relawan, typeRelawan 05: Bendahara Group
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                    "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                    "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.NAMA_GRPX, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, e.CODD_DESC As TypeRelawan " + 
                    "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX left join tb00_basx e on a.TypeRelawan = e.CODD_VALU And e.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' And c.groupID = '" + request.groupID + "' order by a.NamaKry";
                }

                if (typeRelawan <= '04') {  // typePerson 1: Relawan, typeRelawan 04: Korra
                    qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                    "CASE a.StatusAktif " +
                        "WHEN '1' THEN 'ACTIVE' " +
                        "ELSE 'NOT ACTIVE' " +
                    "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, d.NAMA_GRPX, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, e.CODD_DESC As TypeRelawan " + 
                    "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join grpx_relx d on c.groupID = d.IDXX_GRPX left join tb00_basx e on a.TypeRelawan = e.CODD_VALU And e.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' And d.KodeKelurahan like '" + request.KODE_AREA0 + "%' order by a.NamaKry";
                }
            }

            if (typePerson === '4') {   // 4: Offisial
                qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
                "CASE a.StatusAktif " +
                    "WHEN '1' THEN 'ACTIVE' " +
                    "ELSE 'NOT ACTIVE' " +
                "END As StatusAktif2, b.KODE_UNIT, SUBSTRING(a.Alamat1, 1, 20) As Alamat, a.KodeNik As value, CONCAT(a.NamaKry, ' - ', a.KodeNik, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label, IFNULL(c.groupID, '') As groupID, Case a.StatusKry When '1' Then 'OFFISIAL' When '5' Then 'RELAWAN' End As StatusKaryawan, d.CODD_DESC As TypeRelawan " + 
                "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID left join tb00_basx d on a.TypeRelawan = d.CODD_VALU And d.CODD_FLNM = 'TYPE_RELAWAN' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' order by a.NamaKry";
            }
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
                    obj['AUTH_EDIT'] = authEdit;
                    obj['AUTH_DELT'] = authDelt;
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    /* idKaryawans = (request, response) => {
        var status = request.params.status;
        var qryCmd = "select a.KodeNik As value, CONCAT(a.KodeNik, ' - ', a.NamaKry, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label from tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "' order by a.KodeNik";
        
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
    } */

    getEmployeeSelf = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve
        
        var qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
        "CASE a.StatusAktif " +
            "WHEN '1' THEN 'ACTIVE' " +
            "ELSE 'NOT ACTIVE' " +
        "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.KodeNik, ' - ', a.NamaKry, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label " + 
        "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID inner join tb01_lgxh d on a.KodeNik = d.NO_ID where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(d.USER_IDXX) = '" + request.userID.toUpperCase() + "'";

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

    getEmployeeUp = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve
        
        var qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
        "CASE a.StatusAktif " +
            "WHEN '1' THEN 'ACTIVE' " +
            "ELSE 'NOT ACTIVE' " +
        "END As StatusAktif2, b.KODE_UNIT, IFNULL(c.groupID, '') As groupID, a.KodeNik As value, CONCAT(a.KodeNik, ' - ', a.NamaKry, ' - ', SUBSTRING(a.Alamat1, 1, 20)) As label " + 
        "FROM tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT left join vfirst_relawanDet c on a.KodeNik = c.RelawanID inner join tb11_mzjb e on a.KodeNik = e.RelawanID inner join tb01_lgxh d on e.NO_ID = d.NO_ID where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And UPPER(d.USER_IDXX) = '" + request.userID.toUpperCase() + "'";

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

    // get Detail Donaturs dari Karyawan
    getKaryawanDonaturs = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var id = request.params.id;
        
        var qryCmd = "select a.* from tb11_mzjb a inner join tb21_empl b on a.RelawanID = b.KodeNik inner join tb00_unit c on b.BUSS_CODE = c.KODE_UNIT where c.KODE_URUT like '" + request.KODE_URUT0 + "%' And b.KodeNik = '" + id + "'";

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

    // get Detail Relawans dari Group
    getGroupRelawans = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var id = request.params.id;  // IDXX_GRPX
        
        var qryCmd = "select a.*, c.NamaKry from tblRelawanDet a inner join grpx_relx b on a.IDXX_GRPX = b.IDXX_GRPX inner join tb21_empl c on a.RelawanID = c.KodeNik inner join tb00_unit d on b.BUSS_CODE = d.KODE_UNIT where d.KODE_URUT like '" + request.KODE_URUT0 + "%' And b.IDXX_GRPX = '" + id + "' order by a.KODE_URUT";

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
    
}