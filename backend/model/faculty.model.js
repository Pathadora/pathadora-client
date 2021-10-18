const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Faculty = new Schema({
    faculty_name: {
        type: String,
        required: true,
        unique: true
    },
    faculty_department: {
        type : Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    }
});

module.exports = mongoose.model('Faculty', Faculty);
