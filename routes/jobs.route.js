const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

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

router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), newJob);

router.route('/job/:id/:slug').get(getSingleJob);
router.route('/job/:id')
	.put(isAuthenticatedUser, updateJob)
	.delete(isAuthenticatedUser, deleteJob);

module.exports = router;