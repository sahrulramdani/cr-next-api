import db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';


export default class Info {
  getMainDashboardInfo = (req, res) => {
    var sql = "SELECT COUNT( a.KDXX_DFTR ) AS TOTAL_JAMAAH, (SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BGKT = 1 AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS TLH_BGKT, ( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.STAS_BGKT = '0' AND YEAR ( c.CRTX_DATE ) = YEAR ( NOW()) AND c.STAS_BYAR = '1') AS TERJADWAL, ( SELECT COUNT( d.KDXX_DFTR ) FROM mrkt_daftarh d WHERE YEAR ( d.CRTX_DATE ) = YEAR ( NOW()) AND IFNULL(d.STAS_BGKT, '0') = '0' AND (d.DOKX_KTPX = 'n' OR d.DOKX_KKXX = 'n' OR d.DOKX_LAIN = 'n' OR STAS_BYAR = '0') ) AS PROGRES FROM mrkt_daftarh a WHERE YEAR(a.CRTX_DATE) = YEAR(NOW())";

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  };

  getChartMarketing = (req, res) => {
    var sql = `SELECT COUNT( a.KDXX_DFTR ) AS TOTAL_ALL, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '01' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_JAN,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '02' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_FEB,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '03' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_MAR,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '04' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_APR,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '05' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_MEI,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '06' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_JUNI,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '07' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_JULI,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '08' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_AGUS,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '09' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_SEP,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '10' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_OKT,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '11' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_NOV,( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE MONTH ( b.CRTX_DATE ) = '12' AND YEAR ( b.CRTX_DATE ) = YEAR ( NOW())) AS BULAN_DES FROM mrkt_daftarh a WHERE YEAR(a.CRTX_DATE) = YEAR(NOW())`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getChartLaporanTahunan = (req, res) => {
    var sql = `SELECT YEAR(CRTX_DATE) AS TAHUN, COUNT(YEAR(CRTX_DATE)) AS TOTAL FROM mrkt_daftarh WHERE YEAR(CRTX_DATE) BETWEEN CAST(YEAR(NOW()) AS INT) - 9 AND YEAR(NOW()) GROUP BY YEAR(CRTX_DATE)`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDataLaporanTahunan = (req, res) => {
    var sql = `SELECT a.TAHUN, a.TOTAL, b.BERANGKAT FROM (SELECT YEAR(CRTX_DATE) AS TAHUN, COUNT(YEAR(CRTX_DATE)) AS TOTAL FROM mrkt_daftarh WHERE YEAR(CRTX_DATE) BETWEEN CAST(YEAR(NOW()) AS INT) - 9 AND YEAR(NOW()) GROUP BY YEAR(CRTX_DATE)) a INNER JOIN (SELECT YEAR(a.TGLX_BGKT) AS TAHUN, COUNT(b.KDXX_JMAH) AS BERANGKAT  FROM mrkt_jadwalh a INNER JOIN mrkt_daftarh b ON a.IDXX_JDWL = b.KDXX_PKET WHERE b.STAS_BGKT = '1' AND YEAR(a.TGLX_BGKT) BETWEEN CAST(YEAR(NOW()) AS INT) - 9 AND YEAR(NOW()) GROUP BY YEAR(a.TGLX_BGKT)) b ON a.TAHUN = b.TAHUN DESC`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDetailLaporanPencapaian = (req, res) => {
    var sql = `SELECT YEAR ( a.CRTX_DATE ) AS TAHUN, a.KDXX_MRKT, b.NAMA_LGKP, COUNT(a.KDXX_MRKT) AS PEROLEHAN FROM mrkt_daftarh a LEFT JOIN mrkt_agensih b ON a.KDXX_MRKT = b.KDXX_MRKT LEFT JOIN tb00_basx c ON b.FEEX_LVEL = c.CODD_VALU AND c.CODD_FLNM = 'FEELEVEL' WHERE YEAR ( a.CRTX_DATE ) = '${req.params.tahun}' AND c.CODD_DESC = '${req.params.kode}' GROUP BY YEAR(a.CRTX_DATE ), a.KDXX_MRKT ORDER BY COUNT(a.KDXX_MRKT) DESC`;
    
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDetailLaporanTahunan = (req, res) => {
    var sql = `SELECT a.TAHUN, SUM(CASE a.KATEGORI WHEN 'Agen' THEN 1 END) AS AGEN, SUM(CASE a.KATEGORI WHEN 'Cabang' THEN 1 END) AS CABANG, SUM(CASE a.KATEGORI WHEN 'Tourleader' THEN 1 END) AS TOURLEAD, SUM(CASE a.KATEGORI WHEN 'Pusat' THEN 1 END) AS PUSAT, COUNT(a.TAHUN) AS TOTAL FROM (SELECT YEAR ( a.CRTX_DATE ) AS TAHUN, CASE b.FEEX_LVEL WHEN '4951' THEN 'Agen' WHEN '4953' THEN 'Cabang' WHEN '4954' THEN 'Tourleader' ELSE 'Pusat' END AS KATEGORI FROM mrkt_daftarh a LEFT JOIN mrkt_agensih b ON a.KDXX_MRKT = b.KDXX_MRKT LEFT JOIN tb00_basx c ON b.FEEX_LVEL = c.CODD_VALU AND c.CODD_FLNM = 'FEELEVEL' WHERE YEAR ( a.CRTX_DATE ) BETWEEN CAST( YEAR ( NOW()) AS INT ) - 9 AND YEAR (NOW())) a GROUP BY a.TAHUN DESC`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDataLaporanTahunan = (req, res) => {
    var sql = `SELECT a.TAHUN, a.TOTAL, b.BERANGKAT FROM (SELECT YEAR(CRTX_DATE) AS TAHUN, COUNT(YEAR(CRTX_DATE)) AS TOTAL FROM mrkt_daftarh WHERE YEAR(CRTX_DATE) BETWEEN CAST(YEAR(NOW()) AS INT) - 9 AND YEAR(NOW()) GROUP BY YEAR(CRTX_DATE)) a INNER JOIN (SELECT YEAR(a.TGLX_BGKT) AS TAHUN, COUNT(b.KDXX_JMAH) AS BERANGKAT  FROM mrkt_jadwalh a INNER JOIN mrkt_daftarh b ON a.IDXX_JDWL = b.KDXX_PKET WHERE b.STAS_BGKT = '1' AND YEAR(a.TGLX_BGKT) BETWEEN CAST(YEAR(NOW()) AS INT) - 9 AND YEAR(NOW()) GROUP BY YEAR(a.TGLX_BGKT)) b
    ON a.TAHUN = b.TAHUN`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }


  getDataAgensiMarketing = (req, res) => {
    var sql = `SELECT COUNT( a.KDXX_DFTR ) AS TOTAL_ALL, (SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE IFNULL(b.KDXX_MRKT, "") = "" AND YEAR(b.CRTX_DATE) = YEAR(NOW()) ) AS PUSAT, (SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4951' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS AGENSI, (SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4953' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) ) AS CABANG, (SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4954' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) ) AS TOUR_LEADER, (SELECT COUNT( KDXX_DFTR ) FROM mrkt_daftarh WHERE YEAR ( CRTX_DATE ) = YEAR ( NOW())) AS JAMAAH FROM mrkt_daftarh a`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoAgency = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_MRKT) AS TOTAL_MRKT, (SELECT COUNT(b.KDXX_MRKT) FROM mrkt_agensih b WHERE b.FEEX_LVEL = '4951') AS TTL_AGEN, (SELECT COUNT(b.KDXX_MRKT) FROM mrkt_agensih b WHERE b.FEEX_LVEL = '4953') AS TTL_CABANG, (SELECT COUNT(b.KDXX_MRKT) FROM mrkt_agensih b WHERE b.FEEX_LVEL = '4954') AS TTL_TOURLEAD FROM mrkt_agensih a `;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoJadwal = (req, res) => {
    var sql = `SELECT COUNT(a.IDXX_JDWL) AS TOTAL_JADWAL, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.JENS_PKET = '01') AS UMROH_REGULER, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.JENS_PKET = '02') AS UMROH_PLUS, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.JENS_PKET = '03') AS HAJI_FURODA, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.JENS_PKET = '04') AS HAJI_PLUS FROM mrkt_jadwalh a`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoPemberangkatan = (req, res) => {
    var sql = `SELECT COUNT(a.IDXX_JDWL) AS TOTAL_PEMBERANGKATAN, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.STAS_BGKT = '0' AND MONTH(b.TGLX_BGKT) = MONTH(NOW())) AS BULAN_INI, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.STAS_BGKT = '0' AND MONTH(b.TGLX_BGKT) = MONTH(NOW()) + 1) AS BULAN_DEPAN, (SELECT COUNT(b.IDXX_JDWL) FROM mrkt_jadwalh b WHERE b.STAS_BGKT = '0' AND b.JMLX_SEAT = (SELECT COUNT(c.KDXX_DFTR) FROM mrkt_daftarh c WHERE c.KDXX_PKET = b.IDXX_JDWL)) AS SUDAH_FULL FROM mrkt_jadwalh a WHERE a.STAS_BGKT = '0'`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoJamaah = (req, res) => {
    var sql = `SELECT COUNT( a.KDXX_DFTR ) AS ALLJAMAAH, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BYAR = '1' AND b.DOKX_KTPX != 'Belum' AND b.DOKX_KKXX != 'Belum' AND b.DOKX_LAIN != 'Belum' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) ) AS LUNAS_TERJADWAL, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BYAR != '1' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BELUM_LUNAS, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE IFNULL( b.UPDT_DATE, "" ) != "" AND YEAR(b.CRTX_DATE) = YEAR(NOW()) ) AS LUNAS_RESCHEDULE, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BGKT = '1' AND b.STAS_BYAR = '1' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS ALUMNI FROM mrkt_daftarh a WHERE YEAR ( a.CRTX_DATE ) = YEAR ( NOW())`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDataJamaah = (req, res) => {
    var date = new Date();
    var tahun = date.getFullYear();
    var sql = `SELECT COUNT(a.KDXX_DFTR) AS JMLH,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) = YEAR(NOW()) AND MONTH(b.CRTX_DATE) = MONTH(NOW())) AS BULAN_INI,(SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) = YEAR(NOW()) AND MONTH ( b.CRTX_DATE ) = MONTH (NOW()) - 1) AS BULAN_LALU,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) =  YEAR(NOW()) AND MONTH(b.CRTX_DATE) BETWEEN MONTH('${tahun}/01/01') AND MONTH('${tahun}/06/30')) AS ENAM_BULAN,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) =  YEAR(NOW())) AS TAHUN_INI FROM mrkt_daftarh a`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoCalonJamaah = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_JMAH) AS TOTAL, (SELECT COUNT(b.KDXX_JMAH) FROM mrkt_daftarh b WHERE b.STAS_BGKT = '1' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS KONFIRMASI, (SELECT COUNT(b.KDXX_JMAH) FROM mrkt_daftarh b WHERE b.STAS_BGKT = '0' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BLM_BGKT, (SELECT COUNT(b.KDXX_JMAH) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) = YEAR(NOW()) AND (b.DOKX_KKXX = 'n' OR b.DOKX_KTPX = 'n' OR b.DOKX_LAIN = 'n')) AS BLM_LGKP FROM mrkt_daftarh a WHERE YEAR(a.CRTX_DATE) = YEAR(NOW())`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoDaftarJamaah = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_JMAH) AS TOTAL, (SELECT COUNT(b.NOXX_PSPR) FROM jmah_jamaahp b RIGHT JOIN mrkt_daftarh c ON b.NOXX_IDNT = c.KDXX_JMAH WHERE YEAR(c.CRTX_DATE) = YEAR(NOW())) AS PASPOR, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE HANDLING = 'c' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) OR HANDLING = 'a' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS HANDLING , (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE HANDLING = 'n' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BLM_HAND  FROM mrkt_daftarh a WHERE YEAR(a.CRTX_DATE) = YEAR(NOW())`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getChartJamaah = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_DFTR) AS TOTAL_ALL, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '01' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_JAN,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '02' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_FEB,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '03' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_MAR,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '04' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_APR,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '05' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_MEI,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '06' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_JUNI,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '07' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_JULI,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '08' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_AGUS,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '09' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_SEP,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '10' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_OKT,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '11' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_NOV,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = '12' AND YEAR(b.CRTX_DATE) = YEAR(NOW()) AND b.STAS_BGKT = '1') AS BULAN_DES FROM mrkt_daftarh a
    `;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDataOverview = (req, res) => {
    var date = new Date();
    var tahun = date.getFullYear();
    var sql = `SELECT COUNT( a.KDXX_DFTR ) AS TOTAL_JAMAAH, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) = YEAR(NOW()) AND DATE_FORMAT(b.CRTX_DATE, '%m') = DATE_FORMAT(NOW(),'%m')) AS BULAN_INI, ( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.STAS_BGKT = '0' AND YEAR ( c.CRTX_DATE ) = YEAR ( NOW()) AND CAST(DATE_FORMAT(c.CRTX_DATE, '%m') AS INT) = CAST(DATE_FORMAT(NOW(),'%m') AS INT) - 1 ) AS BULAN_LALU, ( SELECT COUNT( d.KDXX_DFTR ) FROM mrkt_daftarh d WHERE CAST(YEAR(d.CRTX_DATE) AS INT) = CAST(YEAR(NOW()) AS INT) - 1 ) AS TAHUN_LALU FROM mrkt_daftarh a WHERE YEAR ( a.CRTX_DATE ) = YEAR ( NOW())`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoFinance = (req, res) => {
    var sql = `SELECT COUNT( a.IDXX_JDWL ) AS TTL_BRGKT, (SELECT COUNT(DISTINCT c.KDXX_JMAH) FROM finc_bayarjamahh b LEFT JOIN mrkt_daftarh c ON b.KDXX_DFTR = c.KDXX_DFTR WHERE b.TGLX_BYAR BETWEEN (SELECT b.AWAL_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') AND (SELECT b.AKHR_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1')) AS TRANSAKSI_JAMAAH, ( SELECT SUM( d.TOTL_TGIH ) FROM mrkt_tagihanh d WHERE d.CRTX_DATE BETWEEN (SELECT b.AWAL_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') AND (SELECT b.AKHR_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') ) AS TGIH_THUN, ( SELECT SUM( e.JMLH_BYAR ) FROM finc_bayarjamahh e WHERE e.TGLX_BYAR BETWEEN (SELECT b.AWAL_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') AND (SELECT b.AKHR_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') ) AS BAYAR_THUN, ( SELECT SUM( f.SISA_TGIH ) FROM mrkt_tagihanh f WHERE f.CRTX_DATE BETWEEN (SELECT b.AWAL_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') AND (SELECT b.AKHR_MUSM FROM sett_musim b WHERE b.STAS_MUSM = '1') ) AS SISA_TGIH FROM mrkt_jadwalh a WHERE DATE_FORMAT( a.TGLX_BGKT, "%Y-%m" ) = DATE_FORMAT(NOW(),"%Y-%m")`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getChartFinance = (req, res) => {
    var sql = `SELECT SUM( a.JMLH_BYAR ) AS TOTAL_ALL, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '01' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_JAN, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '02' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_FEB, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '03' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_MAR, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '04' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_APR, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '05' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_MEI, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '06' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_JUNI, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '07' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_JULI, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '08' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_AGUS, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '09' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_SEP, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '10' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_OKT, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '11' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_NOV, IFNULL((SELECT SUM(b.JMLH_BYAR) FROM finc_bayarjamahh b WHERE MONTH(b.TGLX_BYAR) = '12' AND YEAR(b.TGLX_BYAR) = YEAR(NOW())), 0) AS BULAN_DES FROM finc_bayarjamahh a WHERE YEAR ( a.TGLX_BYAR ) = YEAR (NOW())`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDataFinance = (req, res) => {
    var sql = `SELECT SUM(a.JMLH_BYAR) AS TOTAL_BAYAR, IFNULL((SELECT SUM( b.JMLH_BYAR ) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR ( NOW()) AND DATE_FORMAT( b.TGLX_BYAR, '%m' ) = DATE_FORMAT( NOW(), '%m' )),0) AS BULAN_INI, IFNULL((SELECT SUM( b.JMLH_BYAR ) FROM finc_bayarjamahh b WHERE YEAR ( b.TGLX_BYAR ) = YEAR ( NOW()) AND CAST( DATE_FORMAT( b.TGLX_BYAR, '%m' ) AS INT ) = CAST( DATE_FORMAT( NOW(), '%m' ) AS INT ) - 1),0) AS BULAN_LALU, IFNULL(( SELECT SUM( b.JMLH_BYAR ) FROM finc_bayarjamahh b WHERE CAST( YEAR ( b.TGLX_BYAR ) AS INT ) = CAST( YEAR ( NOW()) AS INT ) - 1 ),0) AS TAHUN_LALU FROM finc_bayarjamahh a WHERE YEAR (a.TGLX_BYAR ) = YEAR (NOW())`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }
}