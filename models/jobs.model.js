const mongoose = require('mongoose');
const validator = require('validator');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'job title is required.'],
        trim: true,
        maxlength: [100, 'job title must be less than 100 characters.'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'job description is required.'],
        trim: true,
        maxlength: [2000, 'job description must be less than 2000 characters.'],
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'email is invalid.'],
    },
    adress: {
        type: String,
        required: [true, 'job adress is required.'],
    },
    company: {
        type: String,
        required: [true, 'job company is required.'],
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: ['IT', 'Finance', 'Marketing', 'Sales', 'HR', 'Education/Training', 'Others'],
            message: 'Select correct option for industry.',
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: ['Full Time', 'Part Time', 'Contract', 'Internship'],
            message: 'Select correct option for job type.',
        }
    },
    minimumEducation: {
        type: String,
        required: true,
        enum: {
            values: ['Bachelor', 'Master', 'PhD'],
            message: 'Select correct option for minimum education.',
        },
    },
    position: {
        type: Number,
        default: 1,
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: ['No experience', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
            message: 'Select correct option for experience.',
        },
    },
    salary: {
        type: Number,
        required: ['true', 'expected salary is required.'],
    },
    postingDate: {
        type: Date,
        default: Date.now,
    },
    applicationDeadline: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 10),
    },
    applicantsApplied: {
        type: [Object],
        select: false,
    }
});

module.exports = mongoose.model('Job', jobSchema);