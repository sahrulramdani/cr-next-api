const express = require('express');
const app = express();
const cors = require('cors');

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(cors());

app.get('/', (request, response) => {
    response.json({ info: 'API SISQU' })
  })

app.listen(3000, () => {
    console.log('Server aktif di port 3000')
});
