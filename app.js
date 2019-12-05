const express = require('express');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
dotEnv.config();

const app = express();
app.get('/', (req, res, next) => {
  res.send(`I LOVE 소니`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(process.env[`DB_URL_${STAGE}`]);
});