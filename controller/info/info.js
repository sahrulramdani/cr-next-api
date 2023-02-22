import db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';


export default class Info {
  getMainDashboardInfo = (req, res) => {
    var sql = "SELECT COUNT( a.NOXX_IDNT ) AS TOTAL_JAMAAH, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BGKT = 1 AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS TLH_BGKT, ( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.STAS_BGKT = '0' AND YEAR(c.CRTX_DATE) = YEAR(NOW())) AS TERJADWAL, ( SELECT COUNT( d.KDXX_DFTR ) FROM mrkt_daftarh d WHERE YEAR(d.CRTX_DATE) = YEAR(NOW()) AND d.DOKX_KTPX = 'Belum' OR d.DOKX_KKXX = 'Belum' OR d.DOKX_LAIN = 'Belum' OR STAS_BYAR = 0) AS PROGRES FROM jmah_jamaahh a";

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  };

  getChartMarketing = (req, res) => {
    var sql = `SELECT COUNT(a.NOXX_IDNT) AS TOTAL_ALL, (SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '01' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_JAN,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '02' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_FEB,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '03' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_MAR,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '04' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_APR,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '05' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_MEI,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '06' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_JUNI,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '07' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_JULI,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '08' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_AGUS,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '09' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_SEP,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '10' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_OKT,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '11' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_NOV,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = '12' AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS BULAN_DES FROM jmah_jamaahh a`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    })
  }

  getDataAgensiMarketing = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_DFTR) AS TOTAL_ALL,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.REFRENSI = "LANGSUNG" AND b.KDXX_MRKT  = " ") AS PUSAT, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4951') AS AGENSI,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4953') AS CABANG, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b INNER JOIN mrkt_agensih c ON b.KDXX_MRKT = c.KDXX_MRKT WHERE c.FEEX_LVEL = '4954') AS TOUR_LEADER,(SELECT COUNT(NOXX_IDNT) FROM jmah_jamaahh WHERE YEAR(CRTX_DATE) = YEAR(NOW())) AS JAMAAH FROM mrkt_daftarh a
    `;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getInfoJamaah = (req, res) => {
    var sql = `SELECT COUNT(a.KDXX_DFTR) AS ALLJAMAAH,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.STAS_BYAR = '1' AND b.DOKX_KTPX != 'Belum' AND b.DOKX_KKXX != 'Belum' AND b.DOKX_LAIN != 'Belum' ) AS LUNAS_TERJADWAL,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.STAS_BYAR != '1') AS BELUM_LUNAS, (SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.UPDT_DATE != " ") AS LUNAS_RESCHEDULE,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE b.STAS_BGKT = '1') AS ALUMNI FROM mrkt_daftarh a`;
    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });
  }

  getDataJamaah = (req, res) => {
    var date = new Date();
    var tahun = date.getFullYear();
    var sql = `SELECT COUNT(a.KDXX_DFTR) AS JMLH,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = MONTH(NOW())) AS BULAN_INI,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE MONTH(b.CRTX_DATE) = MONTH(NOW()) - 1) AS BULAN_LALU,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) =  YEAR(NOW()) BETWEEN MONTH('${tahun}/01/01') AND MONTH('${tahun}/06/30')) AS ENAM_BULAN,(SELECT COUNT(b.KDXX_DFTR) FROM mrkt_daftarh b WHERE YEAR(b.CRTX_DATE) =  YEAR(NOW())) AS TAHUN_INI FROM mrkt_daftarh a`;
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
    var sql = `SELECT COUNT(a.NOXX_IDNT) AS JMLH,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = MONTH(NOW())) AS BULAN_INI,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE MONTH(b.CRTX_DATE) = MONTH(NOW()) - 1) AS BULAN_LALU,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE YEAR(NOW()) BETWEEN DATE_FORMAT('${tahun}-01-01','%Y-%m-%d') AND DATE_FORMAT(NOW(),'%Y-%m-%d'))AS SAMPAI_BULANINI,(SELECT COUNT(b.NOXX_IDNT) FROM jmah_jamaahh b WHERE YEAR(b.CRTX_DATE) = YEAR(NOW()) - 1) AS TAHUN_LALU FROM jmah_jamaahh a`;

    db.query(sql, function (err, rows, fields) {
      res.send(rows);
    });

  }
}