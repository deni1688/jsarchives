const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const df = require('dateformat');
const config = require('./config/keys');
const {
  createSuperuser,
  createDefaultSettings,
  getSettings
} = require('./helpers/onInit');

const app = express();

// load User model
require('./models/User');

// load User model
require('./models/Setting');

// passport config
require('./config/passport')(passport);

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// override with POST having ?_method=PUT
app.use(methodOverride('_method'));

// express session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash messages middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// map global promise - get rid of warning
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose
  .connect(config.mongoURI, {
    useMongoClient: true
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // creates a superuser if no users exist in DB
    createSuperuser();
    // cretaes default settings for website
    createDefaultSettings();
    getSettings(app);
  });

// handlebars middleware - setting view engine to handlebars
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      // Function to do basic mathematical operation in handlebar
      math: (lvalue, operator, rvalue) => {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          '+': lvalue + rvalue,
          '-': lvalue - rvalue,
          '*': lvalue * rvalue,
          '/': lvalue / rvalue,
          '%': lvalue % rvalue
        }[operator];
      },
      // format date
      df: df,
      settings: app.locals.settings
    },
    defaultLayout: 'base'
  })
);
app.set('view engine', 'handlebars');

// router config
const index = require('./routes/index');
const users = require('./routes/users');
const websites = require('./routes/websites');
const campaigns = require('./routes/campaigns');
const subscribers = require('./routes/subscribers');

app.use('/', index);
app.use('/users', users);
app.use('/websites', websites);
app.use('/campaigns', campaigns);
app.use('/subscribers', subscribers);

// default port setting
const port = process.env.PORT || 1234;
app.listen(port, () => console.log('Server is listening on port ' + port));
