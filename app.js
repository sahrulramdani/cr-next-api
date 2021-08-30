import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
app.use(cors());

routes(app);

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
