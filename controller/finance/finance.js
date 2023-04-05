import  db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';
import date from 'date-and-time';

export default class Finance {
    getBiayaAll = (req, res) => {
      var sql = `SELECT a.*, b.CODD_DESC AS JENIS_BIAYA FROM sett_biaya a LEFT JOIN tb00_basx b ON a.JENS_BYAX = b.CODD_VALU`;

      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    };

    getBiayaDetail = (req, res) => {
      var sql = `SELECT a.*, b.CODD_DESC AS JENIS_BIAYA FROM sett_biaya a LEFT JOIN tb00_basx b ON a.JENS_BYAX = b.CODD_VALU WHERE a.KDXX_BYAX = '${req.params.id}'`;
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    }

    generateNumberBiaya = (req, res) => {
      const now = new Date();
      const tgl = date.format(now,"YYYY-MM-DD");
      const tahun = date.format(now,"YYYY");
      const tglReplace = tgl.replace(/-/g,"").toString();

      var sql = `SELECT MAX(RIGHT(a.KDXX_BYAX, 3)) AS URUTX FROM sett_biaya a WHERE DATE_FORMAT( a.CRTX_DATE, "%Y-%m-%d" ) = DATE_FORMAT(NOW(), "%Y-%m-%d" )`;

      db.query(sql, function (err, rows, fields) {
        rows.map((data) => {
          if (data['URUTX'] == null) {
            var noBiaya = `B${tglReplace}001`;

            res.send({
              idBiaya : noBiaya,
            });
          } else {
            var no = parseInt(data['URUTX']) + 1;
            var noBiaya = 'B' + tglReplace + no.toString().padStart(3,"0");
            
            res.send({
              idBiaya : noBiaya,
            });
          }
        });
      });
    }

    saveBiaya = (req, res) => {
      var qry = `INSERT INTO sett_biaya SET ?`;
      var data = {
        KDXX_BYAX : req.body.KDXX_BYAX,
        NAMA_BYAX : req.body.NAMA_BYAX,
        JENS_BYAX : req.body.JENS_BYAX,
        JMLH_BYAX : req.body.JMLH_BYAX,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'superadmin'
      };
  
      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          res.send({
            status : true
          });
        }
      });
    }

    updateBiaya = (req, res) => {
      var qry = `UPDATE sett_biaya SET ? WHERE KDXX_BYAX = "${req.body.KDXX_BYAX}" `;
      var data = {
        KDXX_BYAX : req.body.KDXX_BYAX,
        NAMA_BYAX : req.body.NAMA_BYAX,
        JENS_BYAX : req.body.JENS_BYAX,
        JMLH_BYAX : req.body.JMLH_BYAX,
        UPDT_DATE : new Date(),
        UPDT_BYXX : 'superadmin'
      };
  
      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          res.send({
            status : true
          });
        }
      });
    }

    deleteBiaya = (req,res) => {
      var sql = `DELETE FROM sett_biaya WHERE KDXX_BYAX = '${req.body.KDXX_BYAX}'`;
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


    getJamaahDenganTagihan = (req, res) => {
        // var sql = `SELECT a.*,  DATE_FORMAT( a.TGLX_LHIR, "%d-%m-%Y" ) AS LAHIR ,TIMESTAMPDIFF(YEAR, a.TGLX_LHIR, CURDATE()) AS UMUR, b.CODD_DESC AS MENIKAH, c.CODD_DESC AS PENDIDIKAN, d.CODD_DESC AS PEKERJAAN, e.NOXX_PSPR, e.NAMA_PSPR, e.KLUR_DIXX, e.TGLX_KLUR, e.TGLX_EXPX, f.KDXX_DFTR FROM jmah_jamaahh a LEFT JOIN tb00_basx b ON a.JENS_MNKH = b.CODD_VALU LEFT JOIN tb00_basx c ON a.JENS_PEND = c.CODD_VALU LEFT JOIN tb00_basx d ON a.JENS_PKRJ = d.CODD_VALU LEFT JOIN jmah_jamaahp e ON a.NOXX_IDNT = e.NOXX_IDNT LEFT JOIN mrkt_daftarh f ON a.NOXX_IDNT = f.KDXX_JMAH WHERE STAS_BYAR = 0`;

        var sql = `SELECT a.KDXX_DFTR, a.STAS_BYAR, b.*, DATE_FORMAT( b.TGLX_LHIR, "%d-%m-%Y" ) AS LAHIR, TIMESTAMPDIFF( YEAR, b.TGLX_LHIR, CURDATE()) AS UMUR, c.*, ( SELECT d.CODD_DESC FROM tb00_basx d WHERE d.CODD_VALU = c.NAMA_PKET AND d.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket, ( SELECT d.CODD_DESC FROM tb00_basx d WHERE d.CODD_VALU = c.JENS_PKET AND d.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket, DATE_FORMAT( c.TGLX_BGKT, "%d-%m-%Y" ) AS BERANGKAT, DATE_FORMAT( c.TGLX_PLNG, "%d-%m-%Y" ) AS PULANG, IF ( c.TGLX_BGKT <= DATE_FORMAT( NOW(), "%Y-%m-%d" ), 1, 0 ) AS STS, (( c.JMLX_SEAT ) - ( IFNULL(( SELECT COUNT( e.KDXX_DFTR ) FROM mrkt_daftarh e WHERE e.KDXX_PKET = c.IDXX_JDWL ), 0 ))) AS SISA, (SELECT SUM(d.TOTL_TGIH) FROM mrkt_tagihanh d WHERE d.KDXX_DFTR = a.KDXX_DFTR) AS JML_TGIHAN FROM mrkt_daftarh a LEFT JOIN jmah_jamaahh b ON a.KDXX_JMAH = b.NOXX_IDNT LEFT JOIN mrkt_jadwalh c ON a.KDXX_PKET = c.IDXX_JDWL HAVING STAS_BYAR = 0 AND JML_TGIHAN != '' ORDER BY a.CRTX_DATE DESC`;
    
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

    getMutasiRekening = (req, res) => {
      var sql = `SELECT *, IFNULL(TransNumber,'Kosong') CEK FROM tblmutasi HAVING CEK = 'Kosong'`;
  
      db.query(sql, function (err, rows, fields) {
        res.send(rows);
      });
    };

    getPenerbanganLoss = (req,res) => {
      // DATE_FORMAT(a.TGL_PRMN, "%Y-%m-%d") AS TGL_TRAN
      var sql = `SELECT a.IDXX_JDWL,a.TJAN_PKET,a.PSWT_BGKT, a.JMLX_SEAT,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.NAMA_PKET AND b.CODD_FLNM = "PAKET_XXXX" ) AS namaPaket,( SELECT b.CODD_DESC FROM tb00_basx b WHERE b.CODD_VALU = a.JENS_PKET AND b.CODD_FLNM = "JNS_PAKET" ) AS jenisPaket,DATE_FORMAT( a.TGLX_BGKT, "%d-%m-%Y" ) AS TGLX_BGKT,DATE_FORMAT( a.TGLX_PLNG, "%d-%m-%Y" ) AS TGLX_PLNG,a.JMLX_HARI,a.TARIF_PKET,a.MATA_UANG, ((a.JMLX_SEAT) - (IFNULL((SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = a.IDXX_JDWL),0))) AS SISA ,a.KETERANGAN,IF( a.TGLX_BGKT <= DATE_FORMAT(NOW(), "%Y-%m-%d" ) ,1,0) AS status, (a.JMLX_SEAT * TARIF_PKET) AS EST_PROFIT, IFNULL((SELECT SUM(e.JMLX_BYAR) FROM mrkt_daftarh d LEFT JOIN mrkt_tagihanh e ON d.KDXX_DFTR = e.KDXX_DFTR WHERE d.KDXX_PKET = a.IDXX_JDWL),0) AS TLH_MASUK, IFNULL((SELECT COUNT(e.KDXX_DFTR) FROM mrkt_daftarh e WHERE e.KDXX_PKET = a.IDXX_JDWL),0) AS TERISI FROM mrkt_jadwalh a WHERE a.STAS_AKTF = '1' ORDER BY CRTX_DATE DESC`;
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getLaporanPembayaran = (req,res) => {
      if (req.params.kode == 'Semua') {
        var sql = `SELECT a.NOXX_BYAR, a.NOXX_FAKT, a.TARIF_TGIH, a.DIBAYARKAN, b.NOXX_RESI, DATE_FORMAT( b.TGLX_BYAR, "%d-%m-%Y" ) AS TGLX_BYAR, c.*, 	IFNULL(e.NAMA_LGKP, '-') AS NAMA_LGKP, f.KETX_USER FROM finc_bayarjamahd a LEFT JOIN finc_bayarjamahh b ON a.NOXX_FAKT = b.NOXX_FAKT LEFT JOIN mrkt_tagihanh c ON a.NOXX_TGIH = c.NOXX_TGIH LEFT JOIN mrkt_daftarh d ON c.KDXX_DFTR = d.KDXX_DFTR LEFT JOIN jmah_jamaahh e ON d.KDXX_JMAH = e.NOXX_IDNT LEFT JOIN tb01_lgxh f ON a.CRTX_BYXX = f.USER_IDXX WHERE b.TGLX_BYAR BETWEEN '${req.params.tgl1}' AND '${req.params.tgl2}' ORDER BY b.TGLX_BYAR DESC`;
      } else {
        var sql = `SELECT a.NOXX_BYAR, a.NOXX_FAKT, a.TARIF_TGIH, a.DIBAYARKAN, b.NOXX_RESI, DATE_FORMAT( b.TGLX_BYAR, "%d-%m-%Y" ) AS TGLX_BYAR, c.*, 	IFNULL(e.NAMA_LGKP, '-') AS NAMA_LGKP, f.KETX_USER FROM finc_bayarjamahd a LEFT JOIN finc_bayarjamahh b ON a.NOXX_FAKT = b.NOXX_FAKT LEFT JOIN mrkt_tagihanh c ON a.NOXX_TGIH = c.NOXX_TGIH LEFT JOIN mrkt_daftarh d ON c.KDXX_DFTR = d.KDXX_DFTR LEFT JOIN jmah_jamaahh e ON d.KDXX_JMAH = e.NOXX_IDNT LEFT JOIN tb01_lgxh f ON a.CRTX_BYXX = f.USER_IDXX WHERE JENS_TGIH = '${req.params.kode}' AND b.TGLX_BYAR BETWEEN '${req.params.tgl1}' AND '${req.params.tgl2}' ORDER BY b.TGLX_BYAR DESC`;
      }
  
      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }


    getPembayaranBulanan = (req, res) => {
      var sql = `SELECT IFNULL( SUM( a.JMLH_BYAR ), 0 ) AS TOTAL, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '01'),0) AS JAN, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '02'),0) AS FEB, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '03'),0) AS MAR, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '04'),0) AS APR, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '05'),0) AS MEI, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '06'),0) AS JUN, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '07'),0) AS JUL, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '08'),0) AS AGU, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '09'),0) AS SEP, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '10'),0) AS OKT, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '11'),0) AS NOV, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR(NOW()) AND MONTH(b.TGLX_BYAR) = '12'),0) AS DES FROM finc_bayarjamahh a WHERE YEAR ( a.TGLX_BYAR ) = YEAR (NOW())`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getTotalTagihan = (req, res) => {
      var sql = `SELECT SUM(a.SISA_TGIH) AS TOTAL_TAGIHAN FROM mrkt_tagihanh a WHERE YEAR(a.CRTX_DATE) = YEAR(NOW())`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getPembayaranCabang = (req, res) => {
      // var sql = `SELECT a.*, IFNULL((SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.KDXX_MRKT = a.KDXX_MRKT),0) AS JML_DFTAR, IFNULL((SELECT SUM(d.TOTL_TGIH) FROM mrkt_daftarh c LEFT JOIN mrkt_tagihanh d ON c.KDXX_DFTR = d.KDXX_DFTR WHERE c.KDXX_MRKT = a.KDXX_MRKT AND YEAR(d.CRTX_DATE) = YEAR(NOW())),0) AS TOTL_TGIH, IFNULL((SELECT SUM(d.JMLX_BYAR) FROM mrkt_daftarh c LEFT JOIN mrkt_tagihanh d ON c.KDXX_DFTR = d.KDXX_DFTR WHERE c.KDXX_MRKT = a.KDXX_MRKT AND YEAR(d.CRTX_DATE) = YEAR(NOW())),0) AS JML_BYAR FROM mrkt_agensih a WHERE FEEX_LVEL = '4953'`;

      // By Kantor
      var sql = `SELECT a.*, IFNULL((SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.KDXX_KNTR = a.KDXX_KNTR),0) AS JML_DFTAR, IFNULL((SELECT SUM(d.TOTL_TGIH) FROM mrkt_daftarh c LEFT JOIN mrkt_tagihanh d ON c.KDXX_DFTR = d.KDXX_DFTR WHERE c.KDXX_KNTR = a.KDXX_KNTR AND YEAR ( d.CRTX_DATE ) = YEAR (NOW())),0) AS TOTL_TGIH, IFNULL((SELECT SUM(d.JMLX_BYAR) FROM mrkt_daftarh c LEFT JOIN mrkt_tagihanh d ON c.KDXX_DFTR = d.KDXX_DFTR WHERE c.KDXX_KNTR = a.KDXX_KNTR AND YEAR ( d.CRTX_DATE ) = YEAR (NOW())),0) AS JML_BYAR FROM hrsc_mkantorh a`;

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
        // NAMA_BANK : req.body.KDXX_BANK,
        KETERANGAN : req.body.KETERANGAN,
        TRNS_NUMBER : req.body.TRNS_NUMBER,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'superadmin'
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

          //UPDATE MUTASI REKENING
          if (req.body.TRNS_NUMBER != '') {            
            var updtMut = `UPDATE tblmutasi SET TransNumber = '${req.body.NOXX_FAKT}' WHERE KODE_TRNX = '${req.body.TRNS_NUMBER}'`;     
            db.query(updtMut, (err, result) => {
              if (err) {
                  sts = false;
              } else {
                  sts = true;
              }
            });
          }
  
          res.send({
            status : true
          });
        }
      });
    }


    // MASTER
    getAllAccount = (req, res) => {
      var sql = `SELECT a.*, CONCAT( a.KDXX_COAX, " - ", a.DESKRIPSI ) AS COAX_LBEL, CONCAT( a.KDXX_PARENT, " - ", b.DESKRIPSI ) AS PRENT_LBEL, c.NAMA_KATC, c.JENS_KATC, d.CODD_VALU, d.CODD_DESC FROM finc_coa a LEFT JOIN finc_coa b ON a.KDXX_PARENT = b.KDXX_COAX LEFT JOIN finc_kategori_coa c ON a.KATX_COAX = c.KDXX_KATC LEFT JOIN tb00_basx d ON a.MATA_UANG = d.CODD_VALU ORDER BY a.KDXX_COAX`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    saveAccount = (req, res) => {
      var qry = `INSERT INTO finc_coa SET ?`;
      var data = {
        KDXX_COAX : req.body.KDXX_COAX,
        MATA_UANG : req.body.MATA_UANG,
        DESKRIPSI : req.body.DESKRIPSI,
        KATX_COAX : req.body.KATX_COAX,
        INCX_STMN : '0',
        COAX_LVEL : parseInt(req.body.COAX_LVEL),
        COAX_DKXX : req.body.COAX_DKXX,
        STAS_DKXX : req.body.STAS_DKXX,
        BUDGET : req.body.BUDGET,
        TYPE_COAX : req.body.TYPE_COAX,
        STAS_AKTF : '1',
        KDXX_PARENT : req.body.KDXX_PARENT,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'superadmin'
      };
  
      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          res.send({
            status : true
          });
        }
      });
    }

    updateAccount = (req,res) => {
      var sql = `UPDATE finc_coa SET ? WHERE KDXX_COAX = '${req.body.KDXX_COAX}'`;

      var data = {
        KDXX_COAX : req.body.KDXX_COAX,
        MATA_UANG : req.body.MATA_UANG,
        DESKRIPSI : req.body.DESKRIPSI,
        KATX_COAX : req.body.KATX_COAX,
        INCX_STMN : '0',
        COAX_LVEL : parseInt(req.body.COAX_LVEL),
        COAX_DKXX : req.body.COAX_DKXX,
        STAS_DKXX : req.body.STAS_DKXX,
        BUDGET : req.body.BUDGET,
        TYPE_COAX : req.body.TYPE_COAX,
        STAS_AKTF : '1',
        KDXX_PARENT : req.body.KDXX_PARENT,
        UPDT_BYXX : "superadmin",
        UPDT_DATE : new Date(),
    }

    db.query(sql,data,(err,result) => {
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

    deleteAccount = (req,res) => {
      var sql = `DELETE FROM finc_coa WHERE KDXX_COAX = '${req.body.KDXX_COAX}'`;
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


    generateKodeAccount = (req, res) => {
      var sql = `SELECT KDXX_COAX, COAX_LVEL AS LEVEL FROM finc_coa WHERE KDXX_COAX = '${req.params.id}'`;

      db.query(sql, function(err, rows, fields) {
        if(rows == ''){
          // LEVEL 1
          var urut1 = `SELECT MAX(KDXX_COAX) AS URUT FROM finc_coa WHERE COAX_LVEL = 1`;

          db.query(urut1, function(err, rows, fields) {
            rows.map((data) => {
              if (data['URUT'] != null) {
                var no = parseInt(data['URUT']) + 1;
                var kode = no.toString();
        
                res.send({
                  KDXX_COAX: kode,
                  LVEL_COAX: '1',
                });
              }else{
                res.send({
                  KDXX_COAX: '1',
                  LVEL_COAX: '1',
                });
              }
            });
          })
        }else{
          rows.map((data) => {
            if (data['LEVEL'] == 1) {
              // LEVEL 2
              var urut2 = `SELECT MAX(RIGHT(KDXX_COAX,1)) AS URUT FROM finc_coa WHERE LEFT(KDXX_COAX, 1) = '${req.params.id}' AND LENGTH(KDXX_COAX) = 2`;
              db.query(urut2, function(err, rows, fields) {
                rows.map((data) => {
                  if (data['URUT'] != null) {                    
                    var no = parseInt(data['URUT']) + 1;
                    var kode = `${req.params.id}${no}`;
  
                    res.send({
                      KDXX_COAX: kode,
                      LVEL_COAX: '2',
                    });
                  }else{
                    var kode = `${req.params.id}1`;
  
                    res.send({
                      KDXX_COAX: kode,
                      LVEL_COAX: '2',
                    });
                  }
                });
              })
            }else{
              // LEVEL 3 DST
              var urut3 = `SELECT MAX(RIGHT(KDXX_COAX,2)) AS HASIL , (${data['LEVEL']}) AS URUT FROM finc_coa WHERE LEFT(KDXX_COAX, LENGTH('${req.params.id}')) = '${req.params.id}' AND COAX_LVEL = '${parseInt(data['LEVEL']) + 1}';`

              db.query(urut3, function(err, rows, fields) {
                rows.map((data) => {
                  if (data['HASIL'] != null) {
                    var no = parseInt(data['HASIL']) + 1;
                    var kode = `${req.params.id}` + no.toString().padStart(2,"0");
    
                    res.send({
                      KDXX_COAX: kode,
                      LVEL_COAX: `${parseInt(data['URUT']) + 1}`,
                    });
                  }else{
                    var kode = `${req.params.id}01`;

                    res.send({
                      KDXX_COAX: kode,
                      LVEL_COAX: `${parseInt(data['URUT']) + 1}`,
                    });
                  }
                });
              })
            }
          })
        }
      })
    }

    listTreeAccount = (req, res) => {
        var sql = `SELECT a.*, CONCAT( a.KDXX_COAX, " - ", a.DESKRIPSI ) AS COAX_LBEL, CONCAT( a.KDXX_PARENT, " - ", b.DESKRIPSI ) AS PRENT_LBEL, c.NAMA_KATC, c.JENS_KATC, d.CODD_VALU, d.CODD_DESC FROM finc_coa a LEFT JOIN finc_coa b ON a.KDXX_PARENT = b.KDXX_COAX LEFT JOIN finc_kategori_coa c ON a.KATX_COAX = c.KDXX_KATC LEFT JOIN tb00_basx d ON a.MATA_UANG = d.CODD_VALU ORDER BY a.KDXX_COAX`;

        db.query(sql, function(err, rows, fields) {

            // console.log(rows);

            if (err) {
                throw err;
            }

            var output = [];
            var outputTemp = [];

            // sort Kode Account desc
            rows.sort((a, b) => {
                if (a.KDXX_COAX > b.KDXX_COAX) {
                    return -1;
                } else if (a.KDXX_COAX < b.KDXX_COAX) {
                    return 1;
                };

                return 0;
            });

            if (rows.length > 0) {
                rows.forEach(function(row) {
                    var obj = new Object();
                    for(var key in row) {
                        obj[key] = row[key];
                    }

                    obj.children = [];

                    var check = outputTemp.filter(item => item.KDXX_PARENT === obj.KDXX_COAX);
                    if (check.length > 0) {
                        // sort Kode Account Asc
                        check.sort((a, b) => {
                            if (a.KDXX_COAX < b.KDXX_COAX) {
                                return -1;
                            } else if (a.KDXX_COAX > b.KDXX_COAX) {
                                return 1;
                            };
        
                            return 0;
                        });

                        obj.children = check;
                    }

                    outputTemp.push(obj);
                });

                // output = outputTemp.filter(item => item.CompanyID === companyID && (item.KDXX_PARENT === null || item.KDXX_PARENT === ''));

                output = outputTemp.filter(item => item.KDXX_PARENT === null || item.KDXX_PARENT === '');

                // Sort Kode Account Asc
                output.sort((a, b) => {
                    if (a.KDXX_COAX < b.KDXX_COAX) {
                        return -1;
                    } else if (a.KDXX_COAX > b.KDXX_COAX) {
                        return 1;
                    };

                    return 0;
                });
            }

            res.send(output);
        });
    }

    getAllKasBank = (req, res) => {
      var sql = `SELECT a.*, b.DESKRIPSI, c.CODD_DESC FROM finc_kasbank a LEFT JOIN finc_coa b ON a.ACCT_CODE = b.KDXX_COAX LEFT JOIN tb00_basx c ON a.CURR_MNYX = c.CODD_VALU WHERE a.KODE_FLNM = 'KASX_BANK'`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    getDetailKasBank = (req, res) => {
      var sql = `SELECT a.*, b.DESKRIPSI, c.CODD_DESC FROM finc_kasbank a LEFT JOIN finc_coa b ON a.ACCT_CODE = b.KDXX_COAX LEFT JOIN tb00_basx c ON a.CURR_MNYX = c.CODD_VALU WHERE a.KODE_FLNM = '${req.params.kode}' AND a.KODE_BANK = '${req.params.id}'`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    generateNumberKasBank = (req, res) => {
      var sql = `SELECT MAX(RIGHT(a.KODE_BANK, 2)) AS URUTX FROM finc_kasbank a WHERE a.KODE_FLNM = 'KASX_BANK'`;

      db.query(sql, function (err, rows, fields) {
        rows.map((data) => {
          if (data['URUTX'] == null) {
            var noKasBank = `01`;
  
            res.send({
              idKasBank: noKasBank,
            });
          } else {
            var no = parseInt(data['URUTX']) + 1;
            var noKasBank = no.toString().padStart(2, "0");
  
            res.send({
              idKasBank: noKasBank,
            });
          }
        });
      });
    }

    
    saveKasBank = (req, res) => {
      var qry = `INSERT INTO finc_kasbank SET ?`;
      var data = {
        KODE_FLNM : req.body.KODE_FLNM,
        KODE_BANK : req.body.KODE_BANK,
        NAMA_BANK : req.body.NAMA_BANK,
        CHKX_BANK : req.body.CHKX_BANK,
        ACCT_CODE : req.body.ACCT_CODE,
        CURR_MNYX : req.body.CURR_MNYX,
        NOXX_REKX : req.body.NOXX_REKX,
        ALMT_BANK : req.body.ALMT_BANK,
        NOXX_TELP : req.body.NOXX_TELP,
        NOXX_FAXX : req.body.NOXX_FAXX,
        CRTX_DATE : new Date(),
        CRTX_BYXX : 'superadmin'
      };
  
      db.query(qry, data, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            status: false,
            message: err.sqlMessage,
          });
        } else {
          res.send({
            status : true
          });
        }
      });
    }

    deleteKasBank = (req,res) => {
      var sql = `DELETE FROM finc_kasbank WHERE KODE_BANK = '${req.body.KODE_BANK}' AND KODE_FLNM = '${req.body.KODE_FLNM}'`;

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

    updateKasBank = (req,res) => {
      var sql = `UPDATE finc_kasbank SET ? WHERE KODE_BANK = '${req.body.KODE_BANK}' AND KODE_FLNM = '${req.body.KODE_FLNM}'`;

      var data = {
        KODE_FLNM : req.body.KODE_FLNM,
        KODE_BANK : req.body.KODE_BANK,
        NAMA_BANK : req.body.NAMA_BANK,
        CHKX_BANK : req.body.CHKX_BANK,
        ACCT_CODE : req.body.ACCT_CODE,
        CURR_MNYX : req.body.CURR_MNYX,
        NOXX_REKX : req.body.NOXX_REKX,
        ALMT_BANK : req.body.ALMT_BANK,
        NOXX_TELP : req.body.NOXX_TELP,
        NOXX_FAXX : req.body.NOXX_FAXX,
        UPDT_BYXX : "superadmin",
        UPDT_DATE : new Date(),
    }

    // console.log(data);

    db.query(sql,data,(err,result) => {
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

    getAllCaraBayar = (req, res) => {
      var sql = `SELECT a.*, b.DESKRIPSI, c.CODD_DESC FROM finc_kasbank a LEFT JOIN finc_coa b ON a.ACCT_CODE = b.KDXX_COAX LEFT JOIN tb00_basx c ON a.CURR_MNYX = c.CODD_VALU WHERE a.KODE_FLNM = 'TYPE_BYRX'`;

      db.query(sql, function(err, rows, fields) {
        res.send(rows);
      })
    }

    generateNumberCaraBayar = (req, res) => {
      var sql = `SELECT MAX(RIGHT(a.KODE_BANK, 2)) AS URUTX FROM finc_kasbank a WHERE a.KODE_FLNM = 'TYPE_BYRX'`;

      db.query(sql, function (err, rows, fields) {
        rows.map((data) => {
          if (data['URUTX'] == null) {
            var noKasBank = `01`;
  
            res.send({
              idKasBank: noKasBank,
            });
          } else {
            var no = parseInt(data['URUTX']) + 1;
            var noKasBank = no.toString().padStart(2, "0");
  
            res.send({
              idKasBank: noKasBank,
            });
          }
        });
      });
    }

}