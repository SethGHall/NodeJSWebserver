const logoutController = require('../controllers/logoutController');
const express = require('express');
const router = express.Router();


router.get('/', logoutController.handleLogout);

module.exports = router; 