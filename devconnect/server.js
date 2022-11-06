const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');

// routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// db config
const db = require("./config/keys").mongoURI;

// connect to MongoDB
mongoose
.connect(db)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());
// passport config
require('./config/passport.js')(passport);

// Use routes 
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server runnung on port ${port}`));
