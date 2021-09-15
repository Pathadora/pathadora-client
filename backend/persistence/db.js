const mongoose = require('mongoose');
const host = 'localhost';
const dbPath = 'mongodb://' + host + ':27017/pathadora';

const connectDB = async() => {
  try {
    await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected...");
  } catch(err) {
    console.error(err.message);
    process.exit(-1);
  }
};

module.exports = connectDB;
