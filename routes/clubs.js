const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/',
  tokenValidation.validationToken,
  clubController.getClubs
);

module.exports = router;
