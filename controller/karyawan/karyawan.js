import  db from './../../koneksi.js';
import { generateAutonumber } from './../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Karyawan {
    saveKaryawan = function(req, res) {
        var kodeNik;
        if (req.body.KodeNik === null || req.body.KodeNik === undefined) {
            kodeNik = generateAutonumber(req.body.Initial, req.SequenceUnitCode0, req.body.Tahun, 
                req.body.NextSequenceFormat);
        } else {
            kodeNik = req.body.KodeNik;
        }

        var sql = 'INSERT INTO tb21_empl SET ?';
        var data = {
            KodeNik : kodeNik,
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            BUSS_CODE : req.BUSS_CODE0,
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
                        res.send({
                            status: true
                        });
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
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
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
                                status: true
                            });
                        });
                    }
                });
            }
        });
    }

    saveKaryawanPrsh = function(req, res) {
        var sql = 'INSERT INTO tb21_empx SET ?';
        var data = {
            KodeNik : req.body.KodeNik,
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
        var sql = 'SELECT a.* FROM tb21_empl a INNER JOIN tb00_unit c ON a.BUSS_CODE = c.KODE_UNIT WHERE a.KodeNik = "'+ nik +'" And c.KODE_URUT like "' + req.KODE_URUT0 + '%" ';
        
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

        var id = req.body.id;  // id = nik
        var sql = 'UPDATE `tb21_empl` a INNER JOIN tb00_unit b ON a.BUSS_CODE = b.KODE_UNIT SET ? WHERE a.KodeNik = "'+ id +'" And b.KODE_URUT like "' + req.KODE_URUT0 + '%" ';
        var data = {
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            BUSS_CODE : req.BUSS_CODE0,
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

    updateKaryawanProfile = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var id = req.body.id;  // id = nik
        var sql = 'UPDATE `tb21_empl` a INNER JOIN tb01_lgxh b ON a.KodeNik = b.NO_ID SET ? WHERE a.KodeNik = "' + id + '" And b.USER_IDXX = "' + req.userID + '"';
        console.log(sql);
        var data = {
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            Hp : req.body.Hp,
            CodeCountryHP : req.body.CodeCountryHP,
            'a.email' : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            'a.BUSS_CODE' : req.body.BUSS_CODE,
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
        var sql = 'SELECT a.* FROM tb21_empl a INNER JOIN tb01_lgxh b ON b.NO_ID = a.KodeNik WHERE b.USER_IDXX = "'+ req.userID +'" ';
        
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

        var qryCmd = "select a.*, CONCAT(IFNULL(a.CodeCountryHP, ''), a.Hp) As NoHP2, " + 
        "CASE a.StatusAktif " +
            "WHEN '1' THEN 'ACTIVE' " +
            "ELSE 'NOT ACTIVE' " +
        "END As StatusAktif2 " + 
        "from tb21_empl a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where b.KODE_URUT like '" + request.KODE_URUT0 + "%' And a.StatusKry = '" + status + "'";

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

    idKaryawans = (request, response) => {
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
    }
    
}