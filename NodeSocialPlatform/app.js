const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/GlobalClass');

const container = require('./config/container');


container.resolve(function(users, lodash, admin, home, group, private) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/nodeSocialPaltform', { useMongoClient: true });
    const app = SetupExpress();

    // Start Server
    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        const port = process.env.PORT || 3000;
        const io = socketIO(server);

        server.listen(3000, function() {
            console.log(`Listening on Port ${port}`);
        });

        ConfigureExpress(app);
        require('./socket/groupchat')(io, Users);
        require('./socket/friendrequest')(io);
        require('./socket/globalroom')(io, Global, lodash);
        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        private.SetRouting(router);
        app.use(router);
    }

    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(validator());
        app.use(session({
            secret: 'snicksnacksnook',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals.lodash = lodash;

        // local variable
        app.use((req, res, next) => {
            res.locals.user = req.user || null;
            res.locals.imagePath = 'https://s3.eu-west-2.amazonaws.com/nodesocial/';
            next();
        });
    }
});