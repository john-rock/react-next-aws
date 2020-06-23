const express = require('express');
const router = express.Router();

const { userRegisterValidation } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import from controllers
const { register, registerActivate } = require('../controllers/auth');

//First arg = endpoint, second arg = function(controllers)
router.post('/register', userRegisterValidation, runValidation, register);
router.post('/register/activate', registerActivate);

module.exports = router;