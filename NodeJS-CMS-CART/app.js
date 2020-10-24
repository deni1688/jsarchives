const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const passport = require('passport');


// connect to mongodb
const config = require('./config/config');

// connect database via mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {
    useMongoClient: true
}, (err) => {
    if (err) console.log(err);
    console.log('MongoDB Connected!')
});


// init app
const app = express();

// global errors
app.locals.errors = null;

// Get page model
const Page = require('./models/Page');

// get all pages to pass to front end header
Page.find({}, (err, pages) => {
    if (err) console.log(err);
    app.locals.pages = pages;
});

// Get category model
const Category = require('./models/Category');

// get all pages to pass to front end header
Category.find({}, (err, categories) => {
    if (err) console.log(err);
    app.locals.categories = categories;
});


//express file uplaod middleware
app.use(fileUpload());

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// express session middleware
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

// express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// express validator middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: (value, filename) => {
            let extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public directory
app.use(express.static(path.join(__dirname, 'public')));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set routes
app.get('*', (req, res, next) => {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});


const pages = require('./routes/pages.js');
const adminPages = require('./routes/admin_pages.js');
const adminCategories = require('./routes/admin_categories.js');
const adminProducts = require('./routes/admin_products.js');
const products = require('./routes/products.js');
const cart = require('./routes/cart.js');
const users = require('./routes/users.js');


app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);


// default port
const port = process.env.PORT || 5000;

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});