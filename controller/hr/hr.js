import  db from '../../koneksi.js';
import moment from 'moment';
import { generateAutonumber } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';


export default class HR {
    kantorAll = (req, res) => {
        var sql = "SELECT a.* FROM hrsc_mkantorh a ORDER BY a.CRTX_DATE DESC";
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    };

    detailKantor = (req, res) => {
        var sql = `SELECT a.* FROM hrsc_mkantorh a WHERE a.KDXX_KNTR = '${req.params.id}'`;
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    };

    saveKantor = (req, res) => {
        var sqlInsert = "INSERT INTO hrsc_mkantorh SET ?";
        var data = {
            JENS_KNTR: req.body.JENS_KNTR,
            NAMA_KNTR: req.body.NAMA_KNTR,
            ALMT_KNTR: req.body.ALMT_KNTR,
            TELP_KNTR: req.body.TELP_KNTR,
            CRTX_BYXX: "superadmin",
            CRTX_DATE: new Date(),
        }

        db.query(sqlInsert, data, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
            status: false,
            message: err.sqlMessage,
            });
        } else {
            res.send({
            status: true
            });
        }
        });
    };

    updateKantor = (req, res) => {
        var sql = `UPDATE hrsc_mkantorh SET ? WHERE KDXX_KNTR = '${req.body.KDXX_KNTR}'`;

        var data = {
            KDXX_KNTR: req.body.KDXX_KNTR,
            JENS_KNTR: req.body.JENS_KNTR,
            NAMA_KNTR: req.body.NAMA_KNTR,
            ALMT_KNTR: req.body.ALMT_KNTR,
            TELP_KNTR: req.body.TELP_KNTR,
            UPDT_BYXX: "superadmin",
            UPDT_DATE: new Date(),
        }

        db.query(sql, data, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
            status: false,
            message: err.sqlMessage,
            });
        } else {
            res.send({
            status: true
            });
        }
        });
    }

    deleteKantor = (req, res) => {
        var sql = `DELETE FROM hrsc_mkantorh WHERE KDXX_KNTR = '${req.body.KDXX_KNTR}'`;

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