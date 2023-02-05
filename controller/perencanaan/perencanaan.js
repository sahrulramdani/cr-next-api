import  db from './../../koneksi.js';


export default class Perencanaan {
    saveProgKerja = (req, res) => {
        var sql = 'insert into progx_kerja set ? ';
        var data = {
            KodeProgram : req.body.KodeProgram,
            CompanyID : req.BUSS_CODE0,
            NamaProgram : req.body.NamaProgram,
            Type : req.body.Type,
            KodeAccount : req.body.KodeAccount,
            Kategori : req.body.Kategori,
            Active : req.body.Active,
            TahunBuku : req.body.TahunBuku,
            KodeParent : req.body.KodeParent,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };

        db.query(sql, data, (err, result) => {
            sql = 'select LAST_INSERT_ID() As ID';

            db.query(sql, (err, results) => {
                res.send({
                    status: true,
                    ID: results[0].ID
                });
            });
        });
    }

    listProgramKerja = (req, res) => {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        
        var sql = 'select a.*, Case a.Type When "1" Then "Penerimaan" When "2" Then "Distribusi" When "3" Then "Pendayagunaan" When "4" Then "Operasional" Else "" End As Type from progx_kerja a inner join tb00_unit b on a.CompanyID = b.KODE_UNIT where b.KODE_URUT like "' + req.KODE_URUT0 + '%"';

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

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getProgramKerja = (req, res) => {
        var sql = 'select a.* from progx_kerja a inner join tb00_unit b on a.CompanyID = b.KODE_UNIT where b.KODE_URUT like "' + req.KODE_URUT0 + '" And a.KodeProgram = "' + req.params.id + '"';

        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        });
    }

    getTreeview = function (req,res){
        var sql = "SELECT a.*, b.NamaProgram, b.Type, b.Kategori, b.Active  FROM tb53_mbg a INNER JOIN progx_kerja b ON a.AccountCode = b.KodeAccount WHERE b.Kategori = '1' ";
        db.query(sql, function(err, rows, fields) {
            res.send(rows);
        })
    };
    

    updateProgKerja = (req, res) => {
        var sql = 'update progx_kerja set ? where id = ' + req.body.id;
        var data = {
            KodeProgram : req.body.KodeProgram,
            CompanyID : req.BUSS_CODE0,
            NamaProgram : req.body.NamaProgram,
            Type : req.body.Type,
            KodeAccount : req.body.KodeAccount,
            Kategori : req.body.Kategori,
            Active : req.body.Active,
            KodeParent : req.body.KodeParent,
            UPDT_DATE : new Date(),
            UPDT_BYXX : req.userID
        }

        db.query(sql, data, (err, result) => {
            res.send({
                status: true
            });
        });
    }

    deleteProgKerja = (req, res) => {
        var sql = 'delete from progx_kerja where KodeProgram = "' + req.params.id + '"';

        db.query(sql, (err, results) => {
            res.send({
                status: true
            });
        });
    }
}