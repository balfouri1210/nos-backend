const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search-controller');

router.get('/:keyword',
  searchController.searchPlayer
);

router.get('/club/:clubId',
  searchController.searchPlayerByClub
);

module.exports = router;

