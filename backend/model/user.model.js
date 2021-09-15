const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
  user_email: {
    type: String,
    required: true,
    unique: true
  },
  user_username: {
    type: String,
    required: true,
    unique: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_lastname: {
    type: String,
    required: true
  },
  user_gender: {
    type: String,
    enum : ['male','female','other'],
    default: 'other'
  },
  user_password: {
    type: String,
    required: true
  },
  user_birthDate: {
    type: Date,
    required: true
  },
  user_avatar: {
    type: String
  },
  user_registrationDate: {
    type: Date,
    default: Date.now
  },
  user_role: {
    type: String,
    enum : ['user','teacher','admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', User);
