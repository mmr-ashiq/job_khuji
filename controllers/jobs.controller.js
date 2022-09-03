const Job = require('../models/jobs.model');

// create all job => /api/v1/jobs
exports.getJobs = (req, res, next) => {
	res.status(200).json({
		success: true,
		message: 'This route will display all jobs near future',
	});
};

// create a new job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
    console.log(req.body);
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'job created',
        data: job,
    })
};
