const express = require('express');
const router = express.Router();

const { 
    getJobs,
    newJob,
    getJobsInRadius,
 } = require('../controllers/jobs.controller');

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);

router.route('/job/new').post(newJob);

module.exports = router;
