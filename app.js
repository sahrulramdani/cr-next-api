import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import multer from 'multer';
import db from './koneksi.js';
import { auth } from './controller/auth/index.js';
import { config }  from './config.js';  // config app
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();

app.use(
    express.urlencoded({
        extended: true,
        limit: '500mb',
        parameterLimit: 10000000,
    })
)
app.use(express.json())
app.use(cors());

app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({
  limit: '500mb',
  extended: true,
  parameterLimit: 10000000,
}))      


routes(app);

// API Upload File for Master File
const storage = multer.diskStorage({
       destination: "./uploads/",
       filename: function(req, file, cb) {
          cb(null, file.originalname);
       }
    });

const upload = multer({
                 storage: storage,
                 limits: {fileSize: 5000000},
              }).single('myFile');

app.post("/uploadFile", auth.verifyToken, upload, (req, res, next) => {
      // console.log("Request ---", req.body);
      // console.log("Request file ---", req.file); //Here you get file.

      res.send({
          status: true
      });
   }
);

// API Upload File at Src React Js App
const storage2 = multer.diskStorage({
  destination: config.FolderFile,   
  filename: function(req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload2 = multer({
  storage: storage2,
  limits: {fileSize: 5000000},
}).single('myFile');

app.post("/uploadFile2", auth.verifyToken, upload2, (req, res, next) => {
  while (!fs.existsSync(req.file.path)) {
  }

  res.send({
      status: true
  });
}
);

// API download file
app.get('/download/:id', auth.verifyToken, function(req, res) {
    var id = req.params.id;
    var sql = 'select * from tb52_0001 where id = ' + id;
    
    db.query(sql, function(err, rows, fields) {
        if (rows.length > 0) {
          var dataFile = rows[0];

          const file = `./uploads/` + dataFile.FileName;
          res.download(file); // Set disposition and send it.
        } else {
          res.send(rows);
        }
    });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        status: false,
        message: error.message || 'Internal Server Error',
    });
  });

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
