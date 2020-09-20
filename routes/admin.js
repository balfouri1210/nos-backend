const express = require('express');
const router = express.Router();
const adminBaseController = require('../controllers/admin/base-controller');
const adminUserController = require('../controllers/admin/user-controller');
const adminPlayerController = require('../controllers/admin/player-controller');
const adminClubController = require('../controllers/admin/club-controller');
const tokenValidation = require('../middleware/token-validation');

router.post('/', adminBaseController.login);

// User
router.get('/users-total-count',
  tokenValidation.validationToken,
  adminUserController.getUserTotalCount
);

router.get('/users',
  tokenValidation.validationToken,
  adminUserController.getUsers
);

router.put('/users',
  tokenValidation.validationToken,
  adminUserController.updateUser
);

// Player
router.get('/players',
  tokenValidation.validationToken,
  adminPlayerController.getPlayers
);

router.get('/players/:clubId',
  tokenValidation.validationToken,
  adminPlayerController.getPlayersByClub
);

router.put('/players',
  tokenValidation.validationToken,
  adminPlayerController.updatePlayer
);

router.put('/players/activation',
  tokenValidation.validationToken,
  adminPlayerController.togglePlayerActivation
);

router.post('/players',
  tokenValidation.validationToken,
  adminPlayerController.createPlayer
);

router.delete('/players',
  tokenValidation.validationToken,
  adminPlayerController.deletePlayer
);

// Club
router.get('/clubs',
  tokenValidation.validationToken,
  adminClubController.getClubs
);

router.put('/clubs/activation',
  tokenValidation.validationToken,
  adminClubController.toggleClubActivation
);

module.exports = router;
