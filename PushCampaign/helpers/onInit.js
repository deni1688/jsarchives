// helper function for when the server starts for the first time
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

module.exports = {
    createSuperuser: () => {
        const User = mongoose.model('users');
        User.find({}).then((users, err) => {
            if (err) {
                console.log(err);
            }
            if (users.length < 1) {
                const newUser = new User({
                    name: 'Superuser',
                    email: 'superuser@gmail.com',
                    password: 'password'
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw error;
                        newUser.password = hash;
                        newUser.save();
                    });
                });
            }
        });
    },
    createDefaultSettings: () => {
        const Setting = mongoose.model('settings');
        Setting.find({}).then((settings, err) => {
            if (err) {
                console.log(err);
            }
            if (settings.length < 1) {
                const defaultSettings = new Setting({
                    brandName: 'NPA',
                    themes: {
                        options: [
                            'https://bootswatch.com/4/flatly/bootstrap.min.css',
                            'https://bootswatch.com/4/superhero/bootstrap.min.css',
                            'https://bootswatch.com/4/journal/bootstrap.min.css',
                            'https://bootswatch.com/4/materia/bootstrap.min.css',
                            'https://bootswatch.com/4/minty/bootstrap.min.css'
                        ],
                        active: 'https://bootswatch.com/4/flatly/bootstrap.min.css'
                    },
                    pathToSiteLogo: '/img/npa-logo.svg'
                });
                defaultSettings.save();
            }
        });
    },
    getSettings: (app) => {
        const Setting = mongoose.model('settings');
        Setting.find({})
            .then((settings, err) => {
                if (err) {
                    console.log(err);
                }
                app.locals.settings = settings[0];
            })
            .catch(err => console.log(err));
    }
};