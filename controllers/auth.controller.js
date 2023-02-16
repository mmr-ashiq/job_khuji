const User = require('../models/user.model');
const catchAsync = require('../middlewares/asyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

exports.signup = catchAsync(async (req, res, next) => {
	const { userName, fullName, email, role, password, confirmPassword } = req.body;

	const newUser = await User.create({
		userName,
		fullName,
		email,
		role,
		password,
		confirmPassword,
	});

	sendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler('Please provide email and password', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) {
		console.log('aschi');
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	sendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('User not found with this email', 404));
	}

	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
		message: 'Token sent to your email',
	});
});
