const Job = require('../models/jobs.model');
const geoCoder = require('../utils/geocoder');

// create all job => /api/v1/jobs
exports.getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
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
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs,
    });
};
