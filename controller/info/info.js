import  db from '../../koneksi.js';
import { fncParseComma } from '../../libraries/sisqu/Utility.js';
import { fncCheckProcCode } from '../../libraries/local/localUtility.js';


export default class Info {
    getMainDashboardInfo = (req, res) => {
        var sql = "SELECT COUNT( a.NOXX_IDNT ) AS TOTAL_JAMAAH, ( SELECT COUNT( b.KDXX_DFTR ) FROM mrkt_daftarh b WHERE b.STAS_BGKT = 1 AND YEAR(b.CRTX_DATE) = YEAR(NOW())) AS TLH_BGKT, ( SELECT COUNT( c.KDXX_DFTR ) FROM mrkt_daftarh c WHERE c.STAS_BGKT = '0' AND YEAR(c.CRTX_DATE) = YEAR(NOW())) AS TERJADWAL, ( SELECT COUNT( d.KDXX_DFTR ) FROM mrkt_daftarh d WHERE YEAR(d.CRTX_DATE) = YEAR(NOW()) AND d.DOKX_KTPX = 'Belum' OR d.DOKX_KKXX = 'Belum' OR d.DOKX_LAIN = 'Belum' OR STAS_BYAR = 0) AS PROGRES FROM jmah_jamaahh a";
    
        db.query(sql, function (err, rows, fields) {
          res.send(rows);
        });
    };
}