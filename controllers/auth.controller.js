const User = require('../models/user.model');
const catchAsync = require('../middlewares/asyncErrors');
const ErrorHandler = require('../utils/errorHandler');

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

	const token = newUser.getJwtToken();

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
			message: 'User created successfully',
			token,
		},
	});
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

	const token = user.getJwtToken();

	res.status(200).json({
		status: 'success',
		data: {
			user,
			message: 'User logged in successfully',
			token,
		},
	});
});
