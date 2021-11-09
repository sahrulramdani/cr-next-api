import  db from './../../koneksi.js';

export default class Karyawan {
    getKaryawan = function(req, res) {
        // get user Access
        var authEdit = request.AUTH_EDIT;

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

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    saveKaryawan = function(req, res) {
        var sql = 'INSERT INTO tb21_empl SET ?';
        var data = {
            KodeNik : req.body.KodeNik,
            noxx_NPWP : req.body.noxx_NPWP,
            NamaKry : req.body.NamaKry,
            JenisKel : req.body.JenisKel,
            Alamat1 : req.body.Alamat1,
            Hp : req.body.Hp,
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            StatusAktif : '1',
            StatusKawin : req.body.StatusKawin,
            TglMasuk : req.body.TglMasuk,
            GolDarah : req.body.GolDarah,
            Title : req.body.Title,
            PIC: req.body.PIC,
            NoHPPIC: req.body.NoHPPIC,
            EmailPIC: req.body.EmailPIC,
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
}