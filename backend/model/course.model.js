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
    course_faculty: {
        type : Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    course_language: {
        type: String,
        required: true
    },
    course_period: {
        type: String,
        enum: ['I', 'II'],
        default: 'I',
        required: true
    },
    course_cfu: {
        type: Number,
        required: true
    },
    course_year: {
        type: String,
        enum: ['I', 'II', 'III', 'IV', 'V'],
        default: 'I',
        required: true
    },
    course_type: {
        type: String,
        required: true
    },
    course_scientific_area: {
        type: String,
        required: true
    },
    course_mandatory: {
        type: Boolean,
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
            createdAt: {
              type: Date,
              default: Date.now,
            },
            name: {
              type: String,
              required: [true, "Uploaded file must have a name"],
            },
            resourceTopic: {
                type: String
            },
            adaptionType: [
                {type: String}
            ],
            displayTransformability: [
                {type: String}
            ],
            accessMode: [
                {type: String}
            ],
            resourceType: {
                type: String
            },
            resourceFontSize: {
                type: Number
            },
            resourceExtension: {
                type: String
            },
            resourceReadingEase: {
                type: Number
            },
            resourceCheckRatio: {
                type: Number
            },
            metadata: {}
          }
    ]
});

module.exports = mongoose.model('Course', Course);
