const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./persistence/db');
const path = require('path');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../backend")));

// Connect databasee
connectDB();
app.get('/', (req, res) => res.send('API Running'));

// Define routes
app.use('/users', require('./routes/api/users'));
app.use('/auth', require('./routes/api/auth'));
app.use('/courses', require('./routes/api/courses'));

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
