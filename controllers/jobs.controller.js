const Job = require('../models/jobs.model');
const geoCoder = require('../utils/geocoder');

// create all job => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
	const jobs = await Job.find();

	res.status(200).json({
		success: true,
		results: jobs.length,
		data: jobs,
	});
};

// create a new job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
	const job = await Job.create(req.body);

	res.status(200).json({
		success: true,
		message: 'job created',
		data: job,
	});
};

// Search job with redius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// get lat/lng from geocoder
	const loc = await geoCoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// calc radius using radians
	// divide distance by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const jobs = await Job.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		results: jobs.length,
		data: jobs,
	});
};

// update job => /api/v1/job/:id
exports.updateJob = async (req, res, next) => {
	const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!job) {
		return res.status(404).json({
			success: false,
			message: 'job not found',
		});
	}

	res.status(200).json({
		success: true,
		message: 'job updated',
		data: job,
	});
};

// delete job => /api/v1/job/:id
exports.deleteJob = async (req, res, next) => {
	const job = await Job.findByIdAndDelete(req.params.id);

	if (!job) {
		return res.status(404).json({
			success: false,
			message: 'job not found',
		});
	}

	res.status(200).json({
		success: true,
		message: 'job deleted',
	});
};

// get a single job with id and slug => /api/v1/job/:id/:slug
exports.getSingleJob = async (req, res, next) => {
	const job = await Job.find({
		$and: [{ _id: req.params.id }, { slug: req.params.slug }],
	});

	if (!job || job.length === 0) {
		return res.status(404).json({
			success: false,
			message: 'job not found',
		});
	}

	res.status(200).json({
		success: true,
		data: job,
	});
};

// get stats about a topic => /api/v1/job/stats/:topic
exports.getJobStats = async (req, res, next) => {
	/* const stats = await Job.aggregate([
		{
			$match: { $text: { $search: req.params.topic } },
		},
		{
			$group: {
				_id: null,
				// totalJobs: { $sum: 1 },
				// averagePosition: { $avg: '$position' },
				avgSalary: { $avg: '$salary' },
				// minSalary: { $min: '$salary' },
				// maxSalary: { $max: '$salary' },
			},
		},
	]);

	if (stats.length === 0) {
		return res.status(200).json({
			success: false,
			message: `stats not found for ${req.params.topic}`,
		});
	}

	res.status(200).json({
		success: true,
		data: stats,
	}); */
};

