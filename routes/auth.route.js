const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    forgotPassword,
} = require('../controllers/auth.controller');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);

module.exports = router;