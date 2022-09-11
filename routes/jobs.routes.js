const express = require('express');
const router = express.Router();

const {
	getJobs,
	newJob,
	getJobsInRadius,
	updateJob,
	deleteJob,
	getSingleJob,
} = require('../controllers/jobs.controller');

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/job/new').post(newJob);

router.route('/job/:id/:slug').get(getSingleJob);
router.route('/job/:id').put(updateJob).delete(deleteJob);

module.exports = router;
