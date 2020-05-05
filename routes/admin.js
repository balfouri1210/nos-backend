const express = require('express');
const router = express.Router();
const adminBaseController = require('../controllers/admin/base-controller');
const adminUserController = require('../controllers/admin/user-controller');
const adminPlayerController = require('../controllers/admin/player-controller');
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

router.put('/players',
  tokenValidation.validationToken,
  adminPlayerController.updatePlayer
);

router.post('/players',
  tokenValidation.validationToken,
  adminPlayerController.createPlayer
);

router.delete('/players',
  tokenValidation.validationToken,
  adminPlayerController.deletePlayer
);

module.exports = router;
