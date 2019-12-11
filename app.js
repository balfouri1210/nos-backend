const express = require('express');
var cors = require('cors');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');

const app = express();
dotEnv.config();

app.use(cors()); // Allow cors
app.get('/', (req, res, next) => {
  res.send(`단순 Cloudfront 문젠가?`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(process.env[`DB_URL_${STAGE}`]);
});