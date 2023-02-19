const express = require('express');
const router = express.Router();

const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	logout,
} = require('../controllers/auth.controller');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').put(resetPassword);

module.exports = router;
