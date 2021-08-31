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
            email : req.body.email,
            TempatLahir : req.body.TempatLahir,
            TglLahir : req.body.TglLahir
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

    saveKaryawanPrsh = function(req, res) {
        var sql = 'INSERT INTO tb21_empx SET ?';
        var data = {
            KodeNik : req.body.KodeNik,
            StatusKry : req.body.StatusKry,
            NPWP : req.body.NPWP
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


}