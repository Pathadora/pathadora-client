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
  },
  user_profile: {
    user_language: {
      type: String
    },
    user_degree: {
      type: String
    },
    user_future_degree: {
      type: String
    },
    user_passion: {
      type: String
    },
    user_learning_style: {
      active_reflective: {
        type: String,
        enum : ['Active','Reflective']
      },
      sensing_intuitive: {
        type: String,
        enum : ['Sensing','Intuitive']
      },
      visual_veral: {
        type: String,
        enum : ['Visual','Veral']
      },
      sequential_global: {
        type: String,
        enum : ['Sequential','Global']
      }
    },
    user_goal: {
      type: String,
        enum : ['Deadline Driven','Score Driven','Learning Awards','User Competency','Shortest Path']
    },
    user_disability: {
      type: String
    }
  },
  user_courses: [
    {
      type : Schema.Types.ObjectId,
      ref: 'Course',
      required: false
    }
  ]
});

module.exports = mongoose.model('User', User);
