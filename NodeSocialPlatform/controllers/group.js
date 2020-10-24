'use strict';
module.exports = function(auth, Group, User, async) {
    return {
        SetRouting: function(router) {
            router.get('/group/:name', auth.ensureAuthenticated, this.groupPage);
            router.post('/group/:name', auth.ensureAuthenticated, this.groupPostPage);
        },
        groupPage: function(req, res) {
            const groupName = req.params.name;
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
                Group.findOne({ name: groupName }, (err, group) => {
                    res.render('groupchat/group', {
                        title: groupName,
                        user: req.user,
                        data: res1 || {},
                        path: path,
                        group: group,
                    });
                });
            });
        },
        groupPostPage: function(req, res) {
            async.parallel([
                // update receiver
                function(cb) {
                    if (req.body.receiverName && req.body.receiverName != req.user.username) {
                        User.update({
                            'username': req.body.receiverName,
                            'request.userId': { $ne: req.user._id }, // $ne - not equal to
                            'friendsList.friendId': { $ne: req.user._id }
                        }, {
                            $push: {
                                request: { // push to array
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            },
                            $inc: { totalRequests: 1 } // increment
                        }, (err, count) => {
                            if (err) console.log(err);
                            cb(err, count);
                        });
                    }
                },
                // update sender
                function(cb) {
                    if (req.body.receiverName && req.body.receiverName != req.user.username) {
                        User.update({
                            'username': req.user.username,
                            'sentRequest.username': { $ne: req.body.receiverName }
                        }, {
                            $push: {
                                sentRequest: {
                                    username: req.body.receiverName
                                }
                            }
                        }, (err, count) => {
                            if (err) console.log(err);
                            cb(err, count);
                        });
                    }
                }
            ], (err, result) => {
                if (err) console.log(err);
                res.redirect(`/group/${req.params.name}`);
            });

            async.parallel([
                // this updates the friend list and request array of the receiver
                function(cb) {
                    if (req.body.senderId) {
                        User.update({
                            '_id': req.user._id,
                            'friendsList.friendId': { $ne: req.body.senderId }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName
                                }
                            },
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    userName: req.body.senderName
                                }
                            },
                            $inc: { totalRequests: -1 }
                        }, (err, count) => {
                            cb(err, count);
                        });
                    }
                },
                // this updates the friend list and sentRequest array of the sender
                function(cb) {
                    if (req.body.senderId) {
                        User.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': { $ne: req.user._id }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.user._id,
                                    friendName: req.user.username
                                }
                            },
                            $pull: {
                                sentRequest: {
                                    userName: req.user.username
                                }
                            }
                        }, (err, count) => {
                            cb(err, count);
                        });
                    }
                },
                // clear the request properties from the receiver
                function(cb) {
                    if (req.body.cancelId) {
                        User.update({
                            '_id': req.user._id,
                            'request.userId': {
                                $eq: req.body.cancelId
                            }
                        }, {
                            $pull: {
                                request: {
                                    userId: req.body.cancelId
                                }
                            },
                            $inc: { totalRequests: -1 }
                        }, (err, count) => {
                            cb(err, count);
                        });
                    }
                },
                // clear the request properties from the sender
                function(cb) {
                    if (req.body.cancelId) {
                        User.update({
                            '_id': req.body.cancelId,
                            'sentRequest.username': {
                                $eq: req.user.username
                            }
                        }, {
                            $pull: {
                                sentRequest: {
                                    username: req.user.username
                                }
                            }
                        }, (err, count) => {
                            cb(err, count);
                        });
                    }
                }
            ], (err, result) => {
                if (err) console.log(err);
                res.redirect(`/group/${req.params.name}`);
            });
        }
    };

};