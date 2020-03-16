const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report-controller');
const tokenValidation = require('../middleware/token-validation');

router.post('/',
  tokenValidation.validationToken,
  reportController.reportOpinion
);

module.exports = router;
