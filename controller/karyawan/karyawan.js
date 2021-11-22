import  db from './../../koneksi.js';

export default class Karyawan {
    saveKaryawan = function(req, res) {
        var sql = 'INSERT INTO tb21_empl SET ?';
        var data = {
            KodeNik : req.body.KodeNik,
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
        var sql = 'SELECT a.* FROM tb21_empl a INNER JOIN tb21_empx b ON a.KodeNik = b.KodeNik WHERE a.KodeNik = "'+ nik +'" ';
        
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
        var id = req.body.id;  // id = nik
        var sql = 'UPDATE `tb21_empl` SET ? WHERE KodeNik = "'+ id +'" ';
        var data = {
            KodeNik : req.body.KodeNik,
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

    getProfileKaryawan = function(req, res) {
        var sql = 'SELECT a.* FROM tb21_empl a INNER JOIN tb01_lgxh b ON b.NO_ID = a.KodeNik WHERE b.USER_IDXX = "'+ req.userID +'" ';
        
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }
    
}