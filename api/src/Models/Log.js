const { Schema, model } = require('mongoose');

const Log = new Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: false,
    }
}, {
    timestamps: true,
});

module.exports = model('Log', Log);