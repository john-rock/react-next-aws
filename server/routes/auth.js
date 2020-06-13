const express = require('express');
const router = express.Router();

// Import from controllers
const { register } = require('../controllers/auth')

//First arg = endpoint, second arg = function
router.post('/register', register);

module.exports = router;