const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    userImage: {
        type: String,
        default: 'default.png'
    },
    facebook: {
        type: String,
        default: ''
    },
    fbTokens: Array,
    google: {
        type: String,
        default: ''
    },
    isAdmin: Number,
    sentRequest: [{
        username: { type: String, default: '' }
    }],
    request: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, default: '' }
    }],
    friendsList: [{
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendName: { type: String, default: '' }
    }],
    totalRequests: { type: Number, default: 0 }
});

UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema, 'users');