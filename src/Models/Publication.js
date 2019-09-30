const { Schema, model } = require('mongoose');

const PublicationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    abstract: {
        type: Object,
        required: false,
    },
    pmid: {
        type: Number,
        required: false,
        index: true,
    },
    pmc: {
        type: Number,
        required: false,
        index: true,
        unique: true 
    },
    doi: {
        type: String,
        required: false,
    },
    publisherId: {
        type: String,
        required: false,
    },
    elocationId: {
        type: String,
        required: false,
    },
    contributors: {
        type: Array,
        required: false,   
    },
    journal: {
        type: Object,
        required: false,
    },
    pubDate: {
        type: Array,
        required: true,
    },
    keywords: {
        type: Array,
        required: false,
    },
    categories: {
        type: Array,
        required: false,
    },
    affiliations: {
        type: Array,
        required: false,
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false,
    },
}, {
    timestamps: true,
})

module.exports = model('Publication', PublicationSchema);