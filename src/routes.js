const express = require('express');
const PopulateController = require('./Controllers/PopulateController');
const CountriesController = require('./Controllers/CountriesController');
const PublicationsController = require('./Controllers/PublicationsController');

const routes = express.Router();

// Save countries
routes.post('/countries', CountriesController.save);

// List all countries
routes.get('/countries', CountriesController.list);

// List all coutries with publications count
routes.get('/publications', PublicationsController.list);

// Save publication
routes.post('/publications', PublicationsController.save);

module.exports = routes;