import  db from './../../koneksi.js';
import { fncParseComma } from './../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from './../../libraries/local/localUtility.js';


export default class Setup {
    pekerjaanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PEKERJAAN' order by CODD_DESC";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    pendidikanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'PENDIDIKAN' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    wilayahKerjaAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb20_area where STAT_ACTV = '1'";
        
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    typeRelawanAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd;

        if (request.TYPE_PRSON0 === '4') { // 4: Officer
            qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_RELAWAN' order by CODD_VALU";
        } else {
            qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_RELAWAN' And CODD_VALU >= '" + request.TypeRelawan0 + "' order by CODD_VALU";
        }

        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    typeDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'TYPE_DONATUR' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    typeProgramDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.*, " + 
        "Case a.TypeDonaturMin " +
            "WHEN 'PLATINUM' Then 'P' "  +
            "ELSE b.CODD_VARC " +
        "End As Level " +
        "from typeslp a left join tb00_basx b on a.TypeDonaturMin = b.CODD_DESC And b.CODD_FLNM = 'TYPE_DONATUR' left join tb00_unit c on a.BUSS_CODE = c.KODE_UNIT where c.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.id";
        
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            const filters = request.query;
            const filteredUsers = output.filter(item => {
                let isValid = true;
                for (var key in filters) {
                  isValid = isValid && item[key] == filters[key];
                }
                return isValid;
              });

            response.send(filteredUsers);
        });
    }

    currencyAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'CURR_MNYX' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    donaturProgAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.*, c.CODD_DESC As CategoryDonasi from tb00_basx a inner join tb00_unit b on a.CODD_VARC = b.KODE_UNIT And a.CODD_FLNM = 'PROGRAM_DONATUR' left join tb00_basx c on a.CODD_VAR1 = c.CODD_VALU And c.CODD_FLNM = 'KATEGORI_DONASI' where b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    categoryDonasiAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KATEGORI_DONASI'";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    bankUmumAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BANK' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    departmentAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd;
        if (request.KODE_URUT0 === null || request.KODE_URUT0 === undefined) {
            qryCmd = "select a.* from tb00_basx a inner join tb01_lgxh b on a.CODD_VARC = b.BUSS_CODE where a.CODD_FLNM = 'DEPARTMENT' And UPPER(b.USER_IDXX) = '" + request.userID.toUpperCase() + "' order by a.CODD_VALU";
        } else {
            qryCmd = "select a.* from tb00_basx a inner join tb00_unit b on a.CODD_VARC = b.KODE_UNIT where a.CODD_FLNM = 'DEPARTMENT' And b.KODE_URUT like '" + request.KODE_URUT0 + "%'  order by a.CODD_VALU";
        }
        
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    segmenProfilAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'SEGMENT_PROFILING' order by CODD_DESC";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    unitAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select *, CASE Active WHEN '1' THEN 'ACTIVE' ELSE 'NON-ACTIVE' END As Active2 from tb00_unit where KODE_URUT like '" + request.KODE_URUT0 + "%' order by KODE_URUT";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    unitShowLogin = (request, response) => {
        var qryCmd = "select KODE_UNIT, NAMA_UNIT from tb00_unit where ShowInLogin = '1' order by NAMA_UNIT";

        db.query(qryCmd, function(err, rows, fields) {
            response.send(rows);
        });
    }

    getUnit = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT * FROM `tb00_unit` WHERE KODE_UNIT = "' + id + '"';

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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getDetUnitBanks = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var bussCode = req.params.bussCode;
        var sql = 'SELECT * FROM `tb02_bank` WHERE KODE_FLNM = "KASX_BANK" And BUSS_CODE = "' + bussCode + '" And CHKX_BANK = "1" And IsShow = "1" order by KODE_BANK';

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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    bankAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.* from tb02_bank a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.KODE_FLNM = 'KASX_BANK' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.KODE_BANK";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            const filters = request.query;
            const filteredUsers = output.filter(item => {
                let isValid = true;
                for (var key in filters) {
                  isValid = isValid && item[key] == filters[key];
                }
                return isValid;
              });

            response.send(filteredUsers);
        });
    }

    methodPaymentAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select a.* from tb02_bank a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.KODE_FLNM = 'TYPE_BYRX' And b.KODE_URUT like '" + request.KODE_URUT0 + "%' order by a.KODE_BANK";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            const filters = request.query;
            const filteredUsers = output.filter(item => {
                let isValid = true;
                for (var key in filters) {
                  isValid = isValid && item[key] == filters[key];
                }
                return isValid;
              });

            response.send(filteredUsers);
        });
    }

    locationAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_lokx";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    codeAreaAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb20_area where STAT_ACTV = '1' order by AREA_IDXX";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            const filters = request.query;
            const filteredUsers = output.filter(item => {
                let isValid = true;
                for (var key in filters) {
                  isValid = isValid && item[key].includes(filters[key]);
                }
                return isValid;
              });

            response.send(filteredUsers);
        });
    }

    bussinessUnitAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BUSSINESS_UNIT' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    kelompokKerjaAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'KELOMPOK_KERJA' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    statusMaritalAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'MARY_PART' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    channelDonaturAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'CHANNEL_DONATUR' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    golDarahAll = (request, response) => {
        // get user Access
        var authAdd = request.AUTH_ADDX;
        var authEdit = request.AUTH_EDIT;
        var authDelt = request.AUTH_DELT;
        var authAppr = request.AUTH_APPR;  // auth Approve

        var qryCmd = "select * from tb00_basx where CODD_FLNM = 'BLOD_CODE' order by CODD_VALU";
        db.query(qryCmd, function(err, rows, fields) {
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            response.send(output);
        });
    }

    saveSetup = function(req, res) {
        var sql = 'INSERT INTO tb00_basx SET ?';
        var data = {
            CODD_FLNM : req.body.CODD_FLNM,
            CODD_VALU : req.body.CODD_VALU,
            CODD_DESC : req.body.CODD_DESC,
            CODD_VARC : req.body.CODD_VARC,
            CODD_VAR1 : req.body.CODD_VAR1,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
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

    updateSetup = function(req, res) {
        var type = req.body.CODD_FLNM;
        var value = req.body.CODD_VALU;
        
        var sql = 'UPDATE tb00_basx SET ? WHERE CODD_VALU = "' + value + '" AND CODD_FLNM = "' + type + '"';
        var data = {
            CODD_DESC : req.body.CODD_DESC,
            CODD_VARC : req.body.CODD_VARC,
            CODD_VAR1 : req.body.CODD_VAR1,
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

    deleteSetup = function(req, res) {
        var selectedIds = [];
        selectedIds = fncParseComma(req.body.selectedIds);

        var category = req.body.CODD_FLNM;
        var CODD_VARC = req.body.CODD_VARC;
        var sql = '';

        if (CODD_VARC === undefined) {
            sql = "delete from `tb00_basx` where CODD_FLNM = '" + category + "' And CODD_VALU in (";
        } else {
            sql = "delete from `tb00_basx` where CODD_FLNM = '" + category + "' And CODD_VARC = '" + CODD_VARC + "' And CODD_VALU in (";
        }
    
        var arrayLength = selectedIds.length;
        
        if (arrayLength > 0) {
            for(var i=0; i<arrayLength; i++) {
                if (i === 0) {
                  sql += selectedIds[i];
                } else {
                  sql += ',' + selectedIds[i];
                }
            } 
    
            sql += ')';
            
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
            
        } else {
            res.send({
                status: true
            });
        }
    }

    updateSetupProgDonatur = function(req, res) {
        var type = req.body.CODD_FLNM;
        var value = req.body.CODD_VALU;
        
        var sql = 'UPDATE tb00_basx SET ? WHERE CODD_VALU = "' + value + '" AND CODD_FLNM = "' + type + '" AND CODD_VARC = "' + req.body.CODD_VARC + '"';
        var data = {
            CODD_DESC : req.body.CODD_DESC,
            CODD_VAR1 : req.body.CODD_VAR1,
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

    saveTypeProgramDonatur = function(req, res) {
        var sql = 'INSERT INTO typeslp SET ?';
        var data = {
            id : req.body.id,
            Description : req.body.Description,
            TypeDonaturMin : req.body.TypeDonaturMin,
            Initial : req.body.Initial,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
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

    updateTypeProgramDonatur = function(req, res) {
        var sql = 'UPDATE typeslp SET ? WHERE id = "' + req.body.id + '"';
        var data = {
            Description : req.body.Description,
            TypeDonaturMin : req.body.TypeDonaturMin,
            Initial : req.body.Initial,
            Message : req.body.Message,
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

    deleteTypeProgramDonatur = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `typeslp` where id = '" + id + "'";
        
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

    getTypeProgramDonatur = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT * FROM `typeslp` WHERE id = "'+ id +'" ';
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    saveUnit = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb00_unit SET ?';
        var data = {
            KODE_UNIT : req.body.KODE_UNIT,
            NAMA_UNIT : req.body.NAMA_UNIT,
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            SequenceUnitCode : req.body.SequenceUnitCode,
            // KODE_URUT : req.body.KODE_URUT,
            Active : req.body.Active,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
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

    updateUnit = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'UPDATE tb00_unit SET ? WHERE KODE_UNIT = "' + req.body.KODE_UNIT + '"';
        var data = {
            NAMA_UNIT : req.body.NAMA_UNIT,
            KETX_UNIT : req.body.NAMA_UNIT,
            KODE_LOKX : req.body.KODE_LOKX,
            // KODE_URUT : req.body.KODE_URUT,
            SequenceUnitCode : req.body.SequenceUnitCode,
            Alamat : req.body.Alamat,
            Email : req.body.Email,
            Tertanda : req.body.Tertanda,
            Website : req.body.Website,
            SK_Menkumham : req.body.SK_Menkumham,
            Hotline : req.body.Hotline,
            FileName : req.body.FileName,
            Active : req.body.Active,
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

    deleteUnit = function(req, res) {
        var id = req.body.KODE_UNIT;
        var sql = "delete from `tb00_unit` where KODE_UNIT = '" + id + "'";
        
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

    saveBank = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }

        var sql = 'INSERT INTO tb02_bank SET ?';
        var data = {
            KODE_BANK : req.body.KODE_BANK,
            NAMA_BANK : req.body.NAMA_BANK,
            NOXX_REKX : req.body.NOXX_REKX,
            CURR_MNYX : req.body.CURR_MNYX,
            KODE_FLNM : req.body.KODE_FLNM,
            BUSS_CODE : req.body.BUSS_CODE,
            NOXX_VAXX : req.body.NOXX_VAXX,
            AccountID : req.body.AccountID === '' ? null : req.body.AccountID,
            CHKX_BANK : req.body.CHKX_BANK,
            CHKX_CASH : req.body.CHKX_CASH,
            KODE_KASX_BANK : req.body.KODE_KASX_BANK === undefined ? '' : req.body.KODE_KASX_BANK,
            KUIX_MASK : req.body.KUIX_MASK,
            IsShow : req.body.IsShow,
            CRTX_DATE : new Date(),
            CRTX_BYXX : req.userID
        };
        
        db.query(sql, data, (err, result) => {
            if (err) {
                console.log('Error', err);

                res.send({
                    status: false,
                    message: err.sqlMessage
                });
            } else {
                sql = 'insert into tb02_bnkh set ?';

                data = {
                    KODE_BANK : req.body.KODE_BANK,
                    NOXX_REKX : req.body.NOXX_REKX,
                    VALU_SATX : req.body.CURR_MNYX,
                    VALU_SLDO : 0,
                    CRTX_DATE : new Date(),
                    CRTX_BYXX : req.userID
                }

                db.query(sql, data, (err, result) => {
                    res.send({
                        status: true
                    });
                });
            }
        });
    }

    updateBank = function(req, res) {
        // check Access PROC_CODE 
        if (fncCheckProcCode(req.body.ProcCode, req.procCodes) === false) {
            res.status(403).send({ 
                status: false, 
                message: 'Access Denied',
                userAccess: false
            });

            return;
        }
        
        var id = req.body.id;  // field tb02_bank.id
        var sql = 'UPDATE tb02_bank SET ? WHERE id = ' + id;
        var data = {
            NAMA_BANK : req.body.NAMA_BANK,
            NOXX_REKX : req.body.NOXX_REKX,
            CURR_MNYX : req.body.CURR_MNYX,
            BUSS_CODE : req.body.BUSS_CODE,
            NOXX_VAXX : req.body.NOXX_VAXX,
            AccountID : req.body.AccountID === '' ? null : req.body.AccountID,
            CHKX_BANK : req.body.CHKX_BANK,
            CHKX_CASH : req.body.CHKX_CASH,
            KODE_KASX_BANK : req.body.KODE_KASX_BANK,
            KUIX_MASK : req.body.KUIX_MASK,
            IsShow : req.body.IsShow,
            IsDelete : req.body.IsDelete,
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

    deleteBank = function(req, res) {
        var id = req.body.id;
        var sql = "delete from `tb02_bank` where id = " + id;
        
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

    getBank = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT a.* FROM `tb02_bank` a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT WHERE a.id = "'+ id +'" And a.KODE_FLNM = "KASX_BANK" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }

    getPaymentMethod = function(req, res) {
        // get user Access
        var authAdd = req.AUTH_ADDX;
        var authEdit = req.AUTH_EDIT;
        var authDelt = req.AUTH_DELT;
        var authAppr = req.AUTH_APPR;  // auth Approve

        var id = req.params.id;
        var sql = 'SELECT a.* FROM `tb02_bank` a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT WHERE a.id = ' + id + ' And a.KODE_FLNM = "TYPE_BYRX" And b.KODE_URUT like "' + req.KODE_URUT0 + '%"';
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
                    obj['AUTH_APPR'] = authAppr;

                    output.push(obj);
                })
            }

            res.send(output);
        });
    }
}