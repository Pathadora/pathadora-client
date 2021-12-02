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
        type: Number,
        enum: [1,2],
        default: 1,
        required: true
    },
    course_cfu: {
        type: Number,
        required: true
    },
    course_year: {
        type: Number,
        enum: [1,2,3,4,5],
        default: 1,
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
            metadata: {
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
                extension: {
                    type: String
                },
                readingEase: {
                    type: Number
                },
                contrastRatio: {
                    type: Number
                },
                fontSize: {
                    type: Number
                },
                keywords: [
                    {type: String}
                ]
            }
        }
    ]
});

module.exports = mongoose.model('Course', Course);
