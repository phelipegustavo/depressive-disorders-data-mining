const { Schema, model } = require('mongoose');

const KeywordSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 1,
    },
    publications: [{
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true,
    }],
    countries: [{
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    }]
});

module.exports = model('Keyword', KeywordSchema);
