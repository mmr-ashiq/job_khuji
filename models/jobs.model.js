const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

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
    address: {
        type: String,
        required: [true, 'job adress is required.'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    company: {
        type: String,
        required: [true, 'job company is required.'],
    },
    industry: {
        type: [String],
        required: [true, 'job industry is required.'],
        enum: {
            values: ['IT', 'Finance', 'Marketing', 'Sales', 'HR', 'Education/Training', 'Others'],
            message: 'Select correct option for industry.',
        }
    },
    jobType: {
        type: String,
        required: [true, 'job type is required.'],
        enum: {
            values: ['Full Time', 'Part Time', 'Contract', 'Internship'],
            message: 'Select correct option for job type.',
        }
    },
    minimumEducation: {
        type: String,
        required: [true, 'minimum education is required.'],
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
        required: [true, 'job experience is required.'],
        enum: {
            values: ['No Experience', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

// create job slug from the title
jobSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

jobSchema.pre('save', async function (next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    };
});

module.exports = mongoose.model('Job', jobSchema);