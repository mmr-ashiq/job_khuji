const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: [true, 'userName is required'],
		unique: true,
	},
	fullName: {
		type: String,
		required: [true, 'fullName is required'],
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: [8, 'password must be at least 8 characters'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'confirm password is required'],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are not the same!',
		},
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	passwordResetToken: String,
	passwordResetExpires: Date,
});

exports.User = mongoose.model('User', userSchema);
