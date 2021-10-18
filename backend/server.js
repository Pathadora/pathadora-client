const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./persistence/db');
const path = require('path');
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static(__dirname +'/public'));

// Connect databasee
connectDB();
app.get('/', (req, res) => res.send('API Running'));

// Define routes
app.use('/users', require('./routes/api/users'));
app.use('/auth', require('./routes/api/auth'));
app.use('/courses', require('./routes/api/courses'));
app.use('/departments', require('./routes/api/departments'));
app.use('/faculties', require('./routes/api/faculties'));

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT + " " + __dirname);
});
