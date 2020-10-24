const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        default: 'Undefined'
    }
});

module.exports = mongoose.model('categories', CategorySchema, 'categories');