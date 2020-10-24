'use strict';
module.exports = function(auth, Group, User, async) {
    return {
        SetRouting: function(router) {
            router.get('/chat/:users', auth.ensureAuthenticated, this.privateChatPage);
        },
        privateChatPage: function(req, res) {
            const name = req.params.users;
            const path = res.locals.imagePath;
            async.parallel([
                function(cb) {
                    User.findOne({ 'username': req.user.username })
                        .populate('requests.userId')
                        .exec((err, result) => {
                            cb(err, result);
                        });
                }
            ], (err, result) => {
                const res1 = result[0];
                Group.findOne({ name: name }, (err, group) => {
                    res.render('privatechat/privatechat', {
                        title: name,
                        user: req.user,
                        data: res1 || {},
                        path: path,
                        group: group,
                    });
                });
            });
        },
    };
};