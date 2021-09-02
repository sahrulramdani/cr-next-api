import  db from './../../koneksi.js';

export default class Donatur {
    saveDonatur = function(req, res) {
        var sql = 'INSERT INTO tb11_mzjb SET ?';
        var data = {
            NO_ID : req.body.NO_ID,
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            email : req.body.email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status
        };

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
}