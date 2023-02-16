const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
	role: {
		type: String,
		enum: ['user', 'employee', 'admin'],
		default: 'user',
		message: 'Please select a correct role'
	},
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: [8, 'password must be at least 8 characters'],
		select: false,
	},
	confirmPassword: {
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

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		this.password = await bcrypt.hash(this.password, 12);
		this.confirmPassword = undefined;
		next();
	} catch (err) {
		next(err);
	}
});

userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_TIME,
	});
};

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
