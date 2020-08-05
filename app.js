const express = require('express');
const STAGE = process.env.STAGE || 'local';
const dotEnv = require('dotenv');
const cors = require('cors');

const app = express(); // Generate express app
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://907degrees.com',
    'http://localhost:4000',
    'https://admin-dev.907degrees.com'
  ]
})); // Allow cors
dotEnv.config(); // Use .env file

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/players', require('./routes/players'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/vote', require('./routes/vote'));
app.use('/api/vote-histories', require('./routes/vote-histories'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/report', require('./routes/report'));
app.use('/api/histories', require('./routes/histories'));
app.use('/api/search', require('./routes/search'));
app.use('/api/clubs', require('./routes/clubs'));

app.use('/api/admin', require('./routes/admin'));


app.get('/', (req, res, next) => {
  res.send('NOS api server is running');
});

// Leaderboard Scheduler
require('./scheduler').historyScheduler;

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
