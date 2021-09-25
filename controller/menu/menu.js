import  db from './../../koneksi.js';

export default class Menu {
    moduleAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var typeModule = request.params.typeModule;
        var bussCode = request.params.bussCode;

        var qryCmd = "select * from tb01_modm where BUSS_CODE = '" + bussCode + "' And TYPE_MDUL = '" + typeModule + "' order by NoUrut";
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

    processAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;

        var module = request.params.module;
        var bussCode = request.params.bussCode;

        var qryCmd = "select * from tb01_proc where BUSS_CODE = '" + bussCode + "' And MDUL_CODE = '" + module + "'";
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

}