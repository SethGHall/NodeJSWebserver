const refreshController = require('../controllers/refreshTokenController');
const express = require('express');
const router = express.Router();


router.get('/', refreshController.handleRefreshToken);

module.exports = router;