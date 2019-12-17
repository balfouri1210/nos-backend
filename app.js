const express = require('express');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./database/connection');

const app = express(); // Generate express app
app.use(cors()); // Allow cors
dotEnv.config(); // Use .env file
const db = dbConnection();

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routes/userRoutes'));

app.get('/', (req, res, next) => {
  db.query('select * from user', function (err, result, fields) {
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
