const express = require('express');
var cors = require('cors');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
dotEnv.config(); // Use .env file

const app = express(); // Generate express app
app.use(cors()); // Allow cors

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env[`DB_URL_${STAGE}`],
  user: 'admin',
  password: 'kjh236874',
  database: 'nos'
});

app.get('/', (req, res, next) => {
  connection.query('select * from user', function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(process.env[`DB_URL_${STAGE}`]);
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).send({
    status: 500,
    message: err.message,
    body: {}
  });
});
