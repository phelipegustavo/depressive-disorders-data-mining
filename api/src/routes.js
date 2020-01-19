const express = require('express');
const CountriesController = require('./Controllers/CountriesController');
const PublicationsController = require('./Controllers/PublicationsController');
const LogController = require('./Controllers/LogController');

const routes = express.Router();

// Save countries
routes.post('/countries', CountriesController.save);

// List all countries
routes.get('/countries', CountriesController.list);

// List all coutries with publications count
routes.get('/publications', PublicationsController.list);

// List all publictions of country
routes.get('/publications/:country', PublicationsController.publications);

// Save publication
routes.post('/publications', PublicationsController.save);

// Save log
routes.post('/logs', LogController.save);

module.exports = routes;