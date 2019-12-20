const express = require('express');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
const cors = require('cors');

const mysql = require('mysql');

const pool = mysql.createConnection({
  host: process.env[`DB_URL_${process.env.STAGE}`],
  port: 3306,
  user: 'admin',
  password: 'kjh236874',
  database: 'nos'
});
const getUserResult = pool.query('select * from user');

const app = express(); // Generate express app
app.use(cors()); // Allow cors
dotEnv.config(); // Use .env file

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routes/user-routes'));

app.get('/', (req, res, next) => {
  res.send(getUserResult);
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
