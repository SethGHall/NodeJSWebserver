const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();


router.post('/', authController.handleLogin);


module.exports = router;