const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
	const { name, fullName, email, Password, PasswordConfirm } = req.body;

	const newUser = await User.create({
		name,
		fullName,
		email,
		password,
		PasswordConfirm,
	});


	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});
