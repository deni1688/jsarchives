const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
    brandName: {
        type: String,
        required: true,
    },
    themes: {
        options: {
            type: [{
                type: String,
            }]
        },
        active: {
            type: String,
            required: true
        }
    },
    pathToSiteLogo: {
        type: String, 
        required: true
    }
});

mongoose.model('settings', SettingSchema);

