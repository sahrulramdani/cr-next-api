import db from "./../../koneksi.js";
import GenerateNumber from "./../../libraries/sisqu/GenerateNumber.js";
import moment from "moment";
import { fncCheckProcCode } from "./../../libraries/local/localUtility.js";
import ApiWA from "./../../libraries/automate/apiWABlast.js";
import { config } from "./../../config.js";
import e from "express";
// import multer from "multer.js";
// import multer from "multer";
import fs from 'fs';
import { randomString } from './../../libraries/sisqu/Utility.js';

import date from 'date-and-time';

export default class Inventory {

    // Satuan
    saveInvetorySatuan = (req,res) => {
        var sql = "INSERT INTO invt_satuan SET ?";

        var data = {
            IDXX_STAN : req.body.IDXX_STAN,
            NAMA_STAN : req.body.NAMA_STAN,
            CRTX_BYXX : "alfi",
            CRTX_DATE : new Date(),
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

    updateInventory = (req, res) => {
      var sql = `UPDATE invt_satuan SET ? WHERE IDXX_STAN = "${req.body.IDXX_STAN}"  `;

      var data = {
        NAMA_STAN : req.body.NAMA_STAN,
        UPDT_BYXX : "alfi",
        UPDT_DATE : new Date(),
      }

      console.log(data);

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

    deleteInventorySatuan = (req,res) => {
      var sql = `DELETE FROM invt_satuan WHERE IDXX_STAN = '${req.body.IDXX_STAN}'`;
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

    getAllSatuan = (req,res) => {
      var sql = "SELECT IDXX_STAN,NAMA_STAN FROM invt_satuan";
      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });
    }

    getDetailSatuan = (req,res) => {
      var id = req.params.id;
      var sql = `SELECT IDXX_STAN,NAMA_STAN FROM invt_satuan WHERE IDXX_STAN = '${id}' `;
      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });
    }


    // Barang
    saveBarang = (req,res) => {
      var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '4' AND DOCX_CODE = 'BRG'";
      db.query(sql,function(err,rows,fields) {
        if(rows != '') {
          var no = '';
          rows.map((data) => {
             no = parseInt(data.NOXX_AKHR) + 1;
          })
        }

        var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '4' AND DOCX_CODE = 'BRG' `;

        db.query(sqlUpdtSequence,function(err,rows,fields) {
           var id = "BRG" + no.toString().padStart(6,"0");

              var sql = "INSERT INTO invt_barang SET ?";
        
              var data = {
                KDXX_BRGX : id,
                NAMA_BRGX : req.body.NAMA_BRGX,
                JENS_BRGX : "Material",
                JENS_STUA : req.body.JENS_STUA,
                STOK_BRGX : req.body.STOK_BRGX,
                HRGX_BELI : req.body.HRGX_BELI,
                HRGX_JUAL : req.body.HRGX_JUAL,
                STAT_BRG : '1',
                KETERANGAN : req.body.KETERANGAN,
                CRTX_BYXX : "alfi",
                CRTX_DATE : new Date(),
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

        });
      });
    }

    updateBarang = (req,res) => {
      var sql = `UPDATE invt_barang SET ? WHERE KDXX_BRGX = '${req.body.KDXX_BRGX}'`;

      var data = {
        KDXX_BRGX : req.body.KDXX_BRGX,
        NAMA_BRGX : req.body.NAMA_BRGX,
        JENS_BRGX : "Material",
        JENS_STUA : req.body.JENS_STUA,
        STOK_BRGX : req.body.STOK_BRGX,
        HRGX_BELI : req.body.HRGX_BELI,
        HRGX_JUAL : req.body.HRGX_JUAL,
        STAT_BRG : req.body.STAT_BRG,
        KETERANGAN : req.body.KETERANGAN,
        UPDT_BYXX : "alfi",
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

    updateStokBarang = (req,res) => {
      var sql = `UPDATE invt_barang SET ? WHERE KDXX_BRGX = '${req.body.KDXX_BRGX}' `;
      var stokTotal = parseInt(req.body.STOK_AWAL) + parseInt(req.body.STOK_TABH); 

      var data = {
        STOK_BRGX : stokTotal,
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

    deleteBarang = (req,res) => {
      var sql = `DELETE FROM invt_barang WHERE KDXX_BRGX = '${req.body.KDXX_BRGX}'`;

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


    getBarangAll = (req,res) => {
      var sql = "SELECT a.*, b.NAMA_STAN FROM invt_barang a LEFT JOIN invt_satuan b ON a.JENS_STUA = b.IDXX_STAN";

      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });

    }

    getDetailBarang = (req,res) => {
      var id = req.params.id;
      var sql = `SELECT a.*, b.NAMA_STAN FROM invt_barang a LEFT JOIN invt_satuan b ON a.JENS_STUA = b.IDXX_STAN WHERE KDXX_BRGX = '${id}'`;

      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });
    }

    // Grup Barang

    saveGrupBarangHeader = (req,res) => {
      var sql = "SELECT NOXX_AKHR FROM tb00_sequence WHERE IDXX_XXXX = '2' AND DOCX_CODE = 'GBH'";
      db.query(sql,function(err,rows,fields) {
        if(rows != '') {
          var no = '';
          rows.map((data) => {
             no = parseInt(data.NOXX_AKHR) + 1;
          })
        }

        var sqlUpdtSequence = `UPDATE tb00_sequence SET NOXX_AKHR = '${no}' WHERE IDXX_XXXX = '2' AND DOCX_CODE = 'GBH' `;

        db.query(sqlUpdtSequence, function(err,rows,fields) {
            var id = "GBH"+no.toString().padStart(6,"0");

                var sql = "INSERT INTO invt_grupbrgh SET ?";
          
                var data = {
                  KDXX_GRUP : id,
                  NAMA_GRUP : req.body.NAMA_GRUP,
                  KETERANGAN : req.body.KETERANGAN,
                  CRTX_BYXX : "alfi",
                  CRTX_DATE : new Date(),
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

        });
      })
    }

    saveGrupBarangDetail = (req,res) => {
            var sql = "INSERT INTO invt_grupbrgd SET ?";
      
            var data = {
              KDXX_GRUP : req.body.KDXX_GRUP,
              KDXX_BRGX : req.body.KDXX_BRGX,
              QTYX_BRGX : req.body.QTYX_BRGX,
              CRTX_BYXX : "alfi",
              CRTX_DATE : new Date(),
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

    deleteGrupBarang = (req,res) => {
      var sql = `DELETE FROM invt_grupbrgh WHERE KDXX_GRUP = '${req.body.KDXX_GRUP}' `;

      db.query(sql,function(err,rows,fields) {
        var sqldeleteDetail = `DELETE FROM invt_grupbrgd WHERE KDXX_GRUP = '${req.body.KDXX_GRUP}' `;

        db.query(sqldeleteDetail,(err,result) => {
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
      })
    }

    deleteGrupBarangDetail = (req,res) => {
      var sql = `DELETE FROM invt_grupbrgd WHERE KDXX_GRUP = '${req.body.KDXX_GRUP}' AND KDXX_BRGX = '${req.body.KDXX_BRGX}'`;
      db.query(sql,(err,result) => {
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

    getGrupBrgHeaderAll = (req,res) => {
      var sql = "SELECT a.*,(SELECT COUNT(b.KDXX_GRUP) FROM invt_grupbrgd b WHERE b.KDXX_GRUP = a.KDXX_GRUP ) AS QTY FROM invt_grupbrgh a";
      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });
    }

    getGrupBrgDetail = (req,res) => {
      var sql = `SELECT a.*,b.KETERANGAN,c.NAMA_BRGX,d.NAMA_STAN FROM invt_grupbrgd a LEFT JOIN invt_grupbrgh b ON a.KDXX_GRUP = b.KDXX_GRUP LEFT JOIN invt_barang c ON a.KDXX_BRGX = c.KDXX_BRGX LEFT JOIN invt_satuan d ON c.JENS_STUA = d.IDXX_STAN WHERE a.KDXX_GRUP = '${req.params.id}'`;

      db.query(sql,function(err,rows,fields) {
        res.send(rows);
      });
    }

    

}