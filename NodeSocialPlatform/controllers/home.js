'use strict';

module.exports = function(passport, auth, Group, User, async) {
    return {
        SetRouting: function(router) {
            router.get('/home', auth.ensureAuthenticated, this.homePage);
            router.post('/home', auth.ensureAuthenticated, this.homePagePost);
        },
        homePage: function(req, res) {
            async.parallel([
                function(cb) {
                    if (req.query.groupCategory && req.query.groupCategory != 'All') {
                        const query = req.query.groupCategory;
                        Group.find({ category: query }, (err, groups) => {
                            if (err) console.log(err);
                            cb(err, groups);
                        });
                    } else {
                        Group.find({}, (err, groups) => {
                            if (err) console.log(err);
                            cb(err, groups);
                        });
                    }
                },
                function(cb) {
                    Group.aggregate({
                        $group: {
                            _id: '$category'
                        }
                    }).sort({ _id: 'asce' }).exec((err, categories) => {
                        if (err) console.log(err);
                        cb(err, categories)
                    });
                },
                function(cb) {
                    User.findOne({ 'username': req.user.username })
                        .populate('requests.userId')
                        .exec((err, result) => {
                            cb(err, result);
                        });
                },

            ], (err, results) => {
                if (err) console.log(err);
                const res1 = results[0]; // all groups
                const res2 = results[1]; // all present cat
                const res3 = results[2]; // request data

                return res.render('pages/home', {
                    title: 'Home',
                    user: req.user,
                    groups: res1,
                    path: res.locals.imagePath,
                    categories: res2,
                    data: res3
                });
            });
        },
        homePagePost: function(req, res) {
            async.parallel([
                function(cb) {
                    Group.update({
                        '_id': req.body.groupId,
                        'members.username': { $ne: req.user.username }
                    }, {
                        $push: {
                            members: {
                                username: req.user.username,
                                email: req.user.email
                            }
                        }
                    }, (err, count) => {
                        cb(err, count);
                    });
                }
            ], (err, result) => {
                res.redirect('/home');
            });

        }
    };
};