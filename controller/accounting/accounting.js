import  db from './../../koneksi.js';


export default class Accounting {
        tahunBukuAll = (request, response) => {
            // get user Access
            var authAdd = request.AUTH_ADDX;
            var authEdit = request.AUTH_EDIT;
            var authDelt = request.AUTH_DELT;

            var qryCmd = "select * from tb00_thna order by TGLX_STRT desc";
            db.query(qryCmd, function(err, rows, fields) {
                var output = [];

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

                response.send(output);
            });
            
        }

        saveTahunBuku = function(req, res) {
            var sql = 'INSERT INTO tb00_thna SET ?';
            var data = {
                THNX_AJAR : req.body.THNX_AJAR,
                CABX_CODE : req.body.CABX_CODE,
                KETX_THN : req.body.KETX_THN,
                TGLX_STRT : req.body.TGLX_STRT,
                TGLX_ENDX : req.body.TGLX_ENDX,
                STAT_AKTF : req.body.STAT_AKTF
            };
    
            // set seluruh data Non Aktif
            var sql2 = 'UPDATE tb00_thna SET STAT_AKTF = "0"';
            
            db.query(sql2, (err2, result2) => {
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
            });
        }
}