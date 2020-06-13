const express = require('express');
const router = express.Router();

const { userRegisterValidation } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import from controllers
const { register } = require('../controllers/auth');

//First arg = endpoint, second arg = function
router.post('/register', userRegisterValidation, runValidation, register);

module.exports = router;