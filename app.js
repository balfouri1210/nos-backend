const express = require('express');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
const cors = require('cors');

const app = express(); // Generate express app
app.use(cors()); // Allow cors
dotEnv.config(); // Use .env file

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rouutes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/vote-histories', require('./routes/vote-histories'));

app.get('/', (req, res, next) => {
  res.send('Nos api server is running');
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
