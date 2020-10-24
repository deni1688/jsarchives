const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: 'default.png'
    },
    members: [{
        username: { type: String, default: '' },
        email: { type: String, default: '' }
    }]

});

module.exports = mongoose.model('groups', GroupSchema, 'groups');