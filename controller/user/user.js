import  db from './../../koneksi.js';

export default class User {
    userAll = (request, response) => {
        var qryCmd = "select USER_IDXX, BUSS_CODE, KETX_USER, `Active` from tb01_lgxh order by USER_IDXX";
        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    // tidak didelete melainkan hanya set Active menjadi 0
    deleteUser = (request, response) => {
        var id = request.body.id;
        var qryCmd = "update tb01_lgxh set Active='0' where USER_IDXX = '" + id + "'";
        db.query(qryCmd, (err, result) => {
            if (err) {
                console.log('Error', err);
            } else {
                response.send({
                    status: true
                });
            }
        });
    }
}