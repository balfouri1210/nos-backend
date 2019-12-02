const express = require('express');
const dotEnv = require('dotenv');
dotEnv.config();

const app = express();
app.get('/', (req, res, next) => {
  res.send('Hello from node server! NOS API is served by EC2 and managed by CODEPIPELINE. REALLY?');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});