const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Course = new Schema({
    course_name: {
        type: String,
        required: true,
        unique: true
    },
    course_degree: {
        type: String,
        enum: ['Bachelor', 'Master'],
        default: 'Bachelor',
        required: true
    },
    course_language: {
        type: String,
        required: true
    },
    course_year: {
        type: String,
        required: true
    },
    course_start_date: {
        type: Date,
        required: true
    },
    course_end_date: {
        type: Date,
        required: true
    },
    course_description: {
        type: String
    },
    course_resources: [
        {
            data: Buffer,
            contentType: String
        }
    ]
});

module.exports = mongoose.model('Course', Course);
