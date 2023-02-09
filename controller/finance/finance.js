import  db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';
import date from 'date-and-time';

export default class Finance {
    getJamaahDenganTagihan = (req, res) => {
        var sql = `SELECT a.*,  DATE_FORMAT( a.TGLX_LHIR, "%d-%m-%Y" ) AS LAHIR ,TIMESTAMPDIFF(YEAR, a.TGLX_LHIR, CURDATE()) AS UMUR, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX, f.KDXX_DFTR FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT LEFT JOIN mrkt_daftarh f ON a.NOXX_IDNT = f.KDXX_JMAH WHERE STAS_BYAR = 0`;
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    };

    getJadwalJamaah = (req, res) => {
      var sql = `SELECT a.*, (SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket, (SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket, DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS BERANGKAT, DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS PULANG, IF(a.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS STS, ((a.JMLX_SEAT) - (IFNULL(( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL ), 0 ))) AS SISA, c.* FROM mrkt_jadwalh a LEFT JOIN mrkt_daftarh c ON a.IDXX_JDWL = c.KDXX_PKET HAVING c.STAS_BYAR = '0' AND STS = '0' AND c.KDXX_JMAH = '${req.params.id}'`;
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    };

    getTagihanJamaah = (req, res) => {
      var sql = `SELECT a.*, IF(SISA_TGIH = 0, 'LUNAS', 'BELUM') AS STS_LUNAS, 'false' AS CEK FROM mrkt_tagihanh a HAVING a.KDXX_DFTR = '${req.params.id}' AND STS_LUNAS = 'BELUM'`;
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    };

    getPenerbanganLoss = (req,res) => {
      // DATE_FORMAT(a.TGL_PRMN, "%Y-%m-%d") AS TGL_TRAN
      var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET,a.JENS_PSWT,a.RUTE_AWAL,a.RUTE_TRNS,a.RUTE_AKHR,a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA ,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, (a.JMLX_SEAT * TARIF_PKET) AS EST_PROFIT, IFNULL((SELECT SUM(e.JMLX_BYAR) FROM mrkt_daftarh d LEFT JOIN mrkt_tagihanh e ON d.KDXX_DFTR = e.KDXX_DFTR WHERE d.KDXX_PKET = a.IDXX_JDWL),0) AS TLH_MASUK FROM mrkt_jadwalh a WHERE a.STAS_AKTF = '1' ORDER BY CRTX_DATE DESC`;
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    generateNumberFaktur = (req, res) => {
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tahun = date.format(now,"YYYY");
      const tglReplace = tgl.replace(/-/g,"").toString();

      var sql = `SELECT MAX(RIGHT(a.NOXX_FAKT, 3)) AS URUTX FROM finc_bayarjamahh a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;

      db.query(sql, function (err, rows, fields) {
        rows.map((data) => {
          if (data['URUTX'] == null) {
            var noFaktur = `F${tglReplace}001`;

            res.send({
              idFaktur : noFaktur,
            });
          } else {
            var no = parseInt(data['URUTX']) + 1;
            var noFaktur = 'F' + tglReplace + no.toString().padStart(3,"0");
            
            res.send({
              idFaktur : noFaktur,
            });
          }
        });
      });
    }

    generateNumberPembayaran = () => {
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tglReplace = tgl.replace(/-/g,"").toString();
    
      return new Promise((resolve, reject) => {
          const sql = `SELECT MAX(RIGHT(a.NOXX_BYAR, 3)) AS URUTX FROM finc_bayarjamahd a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;
          db.query(sql, function (err, rows, fields) {
            rows.map((data) => {
              if (data['URUTX'] == null) {
                var noPembayaran = `B${tglReplace}001`;
    
                resolve(noPembayaran);
              } else {
                var no = parseInt(data['URUTX']) + 1;
                var noPembayaran = 'B' + tglReplace + no.toString().padStart(3,"0");
                
                resolve(noPembayaran);
              }
            });
          });
      });
    };

    savePembayaran = (req, res) => {
      var qry = `INSERT INTO finc_bayarjamahh SET ?`;
      var data = {
        NOXX_FAKT : req.body.NOXX_FAKT,
        NOXX_RESI : req.body.NOXX_FAKT,
        KDXX_DFTR : req.body.KDXX_DFTR,
        TGLX_BYAR : new Date(),
        JMLH_BYAR : req.body.TOTL_BYAR,
        CARA_BYAR : req.body.METODE,
        NAMA_BANK : req.body.KDXX_BANK,
        KETERANGAN : req.body.KETERANGAN,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'sahrulramdani20'
      };

      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          var tagihan = req.body.DETX_TGIH;
          var jsonTagihan = JSON.parse(tagihan);
          var sts;
  
          // INSERT JAMAAH BAYAR DETAIL
          for (let i = 0; i < jsonTagihan.length; i++) {
            var idBayar = await this.generateNumberPembayaran();
            var qry = `INSERT INTO finc_bayarjamahd SET ?`;
            var data = {
              NOXX_BYAR : idBayar,
              NOXX_FAKT : req.body.NOXX_FAKT,
              NOXX_TGIH : jsonTagihan[i]['NOXX_TGIH'],
              TARIF_TGIH : jsonTagihan[i]['TOTL_TGIH'],
              DIBAYARKAN : jsonTagihan[i]['JMLX_BYAR'],
              CRTX_DATE : new Date(),
              CRTX_BYXX : 'sahrulramdani20'
            };      
  
            db.query(qry, data, (err, result) => {
                if (err) {
                    sts = false;
                } else {
                    sts = true;
                }
            });
          }

          // UPDATE JAMAAH TAGIHAN
          for (let i = 0; i < jsonTagihan.length; i++) {
            var updQry = `UPDATE mrkt_tagihanh SET JMLX_BYAR = ((JMLX_BYAR) + (${jsonTagihan[i]['JMLX_BYAR']})), SISA_TGIH = '${jsonTagihan[i]['SISA_TGIH']}' WHERE NOXX_TGIH = '${jsonTagihan[i]['NOXX_TGIH']}'`;     
  
            console.log(updQry);
            db.query(updQry, (err, result) => {
                if (err) {
                    sts = false;
                } else {
                    sts = true;
                }
            });
          }

          // UPDATE JAMAAH TAGIHAN
          var getSisa =  `SELECT SUM(a.SISA_TGIH) AS SISA FROM mrkt_tagihanh a WHERE a.KDXX_DFTR = '${jsonTagihan[0]['KDXX_DFTR']}'`
          db.query(getSisa, function (err, rows, fields) {
            rows.map((data) => {
              if(data['SISA'] == 0){
                var updSts = `UPDATE mrkt_daftarh SET STAS_BYAR = '1' WHERE KDXX_DFTR = '${jsonTagihan[0]['KDXX_DFTR']}'`;     
  
                db.query(updSts, (err, result) => {
                    if (err) {
                        sts = false;
                    } else {
                        sts = true;
                    }
                });
              }
            });
          });
  
          res.send({
            status : true
          });
        }
      });
    }
}