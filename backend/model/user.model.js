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
    enum : ['Gender_Male','Gender_Female','Gender_Others'],
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
    user_education: {
      type: String,
      required: true
    },
    user_languages: [
      {
        type: String
      }
    ],
    user_degree: {
      type: String
    },
    user_future_degree: {
      type: String
    },
    user_passions: [
      {
        type: String
      }
    ],
    user_goal: {
      type: String,
        enum : ['Goal_PathDriven','Goal_ScoreDriven','Goal_TimeDriven']
    },
    user_disabilities: [
      {
        name: {
          type: String
        },
        level: {
          type: Number,
          default: 0
        }
      }
    ],
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
