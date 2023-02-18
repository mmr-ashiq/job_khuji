const User = require('../models/user.model');
const catchAsync = require('../middlewares/asyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

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

	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

	const message = `Please click on the link to reset your password: ${resetUrl}\n The link will expire in 10 minutes.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Reset password | job-Khuji',
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to: ${user.email}`,
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});
