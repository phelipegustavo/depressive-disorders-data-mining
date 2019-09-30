const { Schema, model } = require('mongoose');

const CountrySchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    place_id: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: true,
        index: true,
    },
    name_variations: {
        type: Object,
        required: true,
    },
    flag: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
    continent: {
        type: String,
        required: true
    },
    locale: {
        type: String,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    population: {
        type: Number,
        required: true,
    },
    dialcode: {
        type: String,
        required: false,
    },
    population: {
        type: Number,
        required: false,
    },
    regex: {
        type: String,
        required: true,
        index: true,
    },
})

module.exports = model('Country', CountrySchema);