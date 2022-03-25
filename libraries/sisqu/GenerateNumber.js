import moment from 'moment';
import { generateAutonumber } from './Utility.js';
import db from './../../koneksi.js';


export default class GenerateNumber {
    generatedAutonumber;
    nextSequenceFormat;
    initial;
    tahun;
    fncNext;
    BUSS_CODE;
    newData;
    userID;

    constructor(initial, tahun, fncNext) {
        this.generatedAutonumber = null;
        this.nextSequenceFormat = '';
        this.initial = initial;
        this.tahun = tahun;
        this.fncNext = fncNext;
        this.BUSS_CODE = null;
        this.newData = true;
        
        this.userID = '';
        this.eventHandle = this.eventHandle.bind(this);
    }

    eventHandle() {
        this.fncNext(this.initial, this.tahun, this.generatedAutonumber, this.nextSequenceFormat);
    }

    setBussCode(value) {
        this.BUSS_CODE = value;
    }

    setUserID(value) {
        this.userID = value;
    }

    setNewData(value) {
        this.newData = value;
    }

    process() {
        if (this.newData) {
            const getSequence = (initial, tahun, bussCode, fncNext) => {
                var sql = 'select a.*, b.SequenceUnitCode from tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where a.Initial = "' + initial + '" And a.BUSS_CODE = "' + bussCode + '" And a.Tahun = "' + tahun + '"'; 
                
                db.query(sql, (err, rows) => {
                    fncNext(rows);
                }); 
            }

            const fncNextGetSequence = (rows) => {
                if (rows.length > 0) {
                    var sequence = rows[0];
                    var nextSequence = parseInt(sequence.NOXX_URUT) + 1;
                    this.nextSequenceFormat = nextSequence.toString().padStart(6, '0');

                    this.generatedAutonumber = generateAutonumber(this.initial, sequence.SequenceUnitCode, this.tahun, this.nextSequenceFormat);
                } else {
                    this.nextSequenceFormat = '000001';
                }
                
                this.saveUpdate();
            }

            getSequence(this.initial, this.tahun, this.BUSS_CODE, fncNextGetSequence);
        } else {
            this.eventHandle();
        }
    }

    saveUpdate() {
        if (this.generatedAutonumber === null) {
            /* var data = {
                Initial : this.initial,
                Tahun : this.tahun,
                BUSS_CODE : this.BUSS_CODE,
                NOXX_URUT : this.nextSequenceFormat
            } */

            const saveSequence = (bussCode, NOXX_URUT, Tahun, Initial, fncNext) => {
                if (bussCode === undefined || bussCode === null) {
                    bussCode = '';
                } 
        
                var sql = 'INSERT INTO tblsequence (Initial, BUSS_CODE, Tahun, SequenceUnitCode, NOXX_URUT, TGLX_PROC) select "' + Initial + '", CASE "' + bussCode + '" When "" Then a.BUSS_CODE Else "' + bussCode + '" END,' + Tahun + ', b.SequenceUnitCode,"' + NOXX_URUT + '","' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') +  '" from tb01_lgxh a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT where UPPER(a.USER_IDXX) = "' + this.userID.toUpperCase() + '"';
                
                db.query(sql, (err, result) => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        if (bussCode === '') {
                            sql = 'update tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT inner join tb01_lgxh c on b.KODE_UNIT = c.BUSS_CODE set a.SequenceUnitCode = b.SequenceUnitCode where a.Initial = "' + Initial + '" And a.Tahun = "' + Tahun + '" And UPPER(c.USER_IDXX) = "' + this.userID.toUpperCase() + '"';
                        } else {
                            sql = 'update tblsequence a inner join tb00_unit b on a.BUSS_CODE = b.KODE_UNIT set a.SequenceUnitCode = b.SequenceUnitCode where a.Initial = "' + Initial + '" And a.Tahun = "' + Tahun + '" And a.BUSS_CODE = "' + bussCode + '"';
                        }
        
                        db.query(sql, (err, result) => {
                            fncNext();
                        });
                    }
                });
            }

            saveSequence(this.BUSS_CODE, this.nextSequenceFormat, this.tahun, this.initial, this.eventHandle);
        } else {
            /* var data = {
                Initial : this.initial,
                Tahun : this.tahun,
                BUSS_CODE : this.BUSS_CODE,
                NOXX_URUT : this.nextSequenceFormat
            } */

            const updateSequence = (bussCode, NOXX_URUT, Tahun, Initial, fncNext) => {
                if (bussCode === null || bussCode === undefined) {
                    bussCode = req.BUSS_CODE0;
                } 
        
                var tgl = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        
                var sql = "update tblsequence set NOXX_URUT = '" + NOXX_URUT + "', TGLX_PROC = '" + tgl + "' where Initial = '" + Initial + "' And BUSS_CODE = '" + bussCode + "' And Tahun = '" + Tahun + "'";
        
                db.query(sql, (err, result) => {
                    if (err) {
                        console.log('Error', err);

                    } else {
                        fncNext();
                    }
                });
            }

            updateSequence(this.BUSS_CODE, this.nextSequenceFormat, this.tahun, this.initial, this.eventHandle);
        }
    }
}