const express = require('express');
const router = express.Router();

const { userRegisterValidation, userLoginValidation } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import from controllers
const { register, registerActivate, login } = require('../controllers/auth');

//First arg = endpoint, second arg = function(controllers)
router.post('/register', userRegisterValidation, runValidation, register);
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidation, runValidation, login);

module.exports = router;