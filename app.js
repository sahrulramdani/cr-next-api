import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import multer from 'multer';
import db from './koneksi.js';
import { auth } from './controller/auth/index.js';

const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use(cors());

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

// API Upload File for Image Profile
const storage2 = multer.diskStorage({
  destination: 'D:\\VICKY\\React JS\\sisqu2\\files\\profiles\\',   
  filename: function(req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload2 = multer({
  storage: storage2,
  limits: {fileSize: 5000000},
}).single('myFile');

app.post("/uploadImageFile", auth.verifyToken, upload2, (req, res, next) => {
  res.send({
      status: true
  });
}
);

// API download file
app.get('/download/:id', auth.verifyToken, function(req, res) {
    // get user Access
    var rightAuth = request.RIGH_AUTH;

    var id = req.params.id;
    var sql = 'select * from tb52_0001 where id = ' + id;

    if (rightAuth === '1') {
      db.query(sql, function(err, rows, fields) {
          if (rows.length > 0) {
            var dataFile = rows[0];

            const file = `./uploads/` + dataFile.FileName;
            res.download(file); // Set disposition and send it.
          } else {
            res.send(rows);
          }
      });
    } else {
        res.status(403).send({ 
            status: false, 
            message: 'Access Denied',
            userAccess: false
        });
    }
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  });

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
