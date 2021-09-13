import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import * as C from './controller/index.js';
import multer from 'multer';

const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use(cors());

routes(app);

// API Upload File
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

app.post("/uploadFile", upload, (req, res, next) => {
      console.log("Request ---", req.body);
      console.log("Request file ---", req.file); //Here you get file.

      res.send({
          status: true
      });
   }
);

// API download file
app.get('/download', function(req, res) {
    const file = `./uploads/Sistem Pengelolaan Data Donatur.pdf`;
    res.download(file); // Set disposition and send it.
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
