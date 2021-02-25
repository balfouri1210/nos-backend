const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club-controller');
const apicache = require('apicache');
// const tokenValidation = require('../middleware/token-validation');

const cache = apicache.middleware; // Generate api cache instance

router.get('/',
  clubController.getClubs
);

router.get(
  '/standings',
  cache('30 minutes'),
  clubController.getClubStandings
);

module.exports = router;
