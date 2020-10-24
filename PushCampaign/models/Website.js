const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WebsiteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subscribers: {
        type: [{
            subscription: {
                type: Object,
                required: true
            },
            isMobile: {
                type: Boolean,
                required: true
            },
            date: {
                type: Date
            }
        }]
    },
    campaigns: {
        type: [{
            date: {
                type: Date
            },
            clickBacks: {
                type: Number
            },
            content: {
                title: {
                    type: String,
                    required: true,
                },
                icon: {
                    type: String,
                    required: true,
                },
                body: {
                    type: String,
                    required: true,
                },
                tag: {
                    type: String,
                    required: true,
                },
                data: {
                    type: Schema.Types.Mixed
                }
            }
        }]
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('websites', WebsiteSchema);