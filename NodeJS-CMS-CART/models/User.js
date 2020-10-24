const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Page Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
    },


});

module.exports = mongoose.model('users', UserSchema, 'users');