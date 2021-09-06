import  db from './../../koneksi.js';

export default class Donatur {
    idDonaturs = (request, response) => {
        var status = request.params.status

        var qryCmd = "";
        if (status === "0") {
            // All
            qryCmd = "select NO_ID As value, CONCAT(`NO_ID`, ' - ', `NAMA`, ' - ', SUBSTRING(`ALMT_XXX1`, 1, 20)) As label from tb11_mzjb order by NO_ID";
        } else {
            qryCmd = "select NO_ID As value, CONCAT(`NO_ID`, ' - ', `NAMA`, ' - ', SUBSTRING(`ALMT_XXX1`, 1, 20)) As label from tb11_mzjb where Status = '" + status + "'  order by NO_ID";
        }
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    getDonatur = function(req, res) {
        var id = req.params.id;

        var sql = 'SELECT * FROM tb11_mzjb WHERE NO_ID = "'+ id +'"';
        db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    }

    saveDonatur = function(req, res) {
        var sql = 'INSERT INTO tb11_mzjb SET ?';
        var data = {
            NO_ID : req.body.NO_ID,
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum
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

    updateDonatur = function(req, res) {
        var id = req.body.NO_ID;

        var sql = 'UPDATE tb11_mzjb SET ? WHERE NO_ID = "' + id + '"';
        var data = {
            NPWP : req.body.NPWP,
            NAMA : req.body.NAMA,
            JNKX_KLMN : req.body.JNKX_KLMN,
            ALMT_XXX1 : req.body.ALMT_XXX1,
            NoHP : req.body.NoHP,
            Email : req.body.Email,
            TMPX_LHRX : req.body.TMPX_LHRX,
            TGLX_LHRX : req.body.TGLX_LHRX,
            BUSS_CODE : req.body.BUSS_CODE,
            NoKTP : req.body.NoKTP,
            Stat_aktf : '1',
            StatusKawin : req.body.StatusKawin,
            TglX_MASK : req.body.TglX_MASK,
            Status : req.body.Status,
            TypeBadan : req.body.TypeBadan,
            TypeDonatur : req.body.TypeDonatur,
            FlgPlatinum : req.body.FlgPlatinum
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