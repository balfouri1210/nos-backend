const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club-controller');
// const tokenValidation = require('../middleware/token-validation');

router.get('/',
  clubController.getClubs
);

module.exports = router;
