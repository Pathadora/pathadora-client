const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Department = new Schema({
    department_name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Department', Department);

