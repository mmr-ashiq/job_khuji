const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth');

const {
	getJobs,
	newJob,
	getJobsInRadius,
	updateJob,
	deleteJob,
	getSingleJob,
	getJobStats,
} = require('../controllers/jobs.controller');

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
router.route('/jobs/stats').get(getJobStats);

router.route('/job/new').post(isAuthenticatedUser, newJob);

router.route('/job/:id/:slug').get(getSingleJob);
router.route('/job/:id').put(updateJob).delete(deleteJob);


module.exports = router;
