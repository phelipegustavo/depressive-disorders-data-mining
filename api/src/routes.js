const express = require('express');
const CountriesController = require('./Controllers/CountriesController');
const PublicationsController = require('./Controllers/PublicationsController');
const ChartController = require('./Controllers/ChartController');
const LogController = require('./Controllers/LogController');
const KeywordController = require('./Controllers/KeywordController')

const routes = express.Router();

// Save countries
routes.post('/countries', CountriesController.save);

// List all countries
routes.get('/countries', CountriesController.list);
   
// List Keywords By Country
routes.get('/countries/:country/keywords', CountriesController.keywords);

// List all coutries with publications count
routes.get('/publications', PublicationsController.list);

// List all publictions of country
routes.get('/publications/:country', PublicationsController.publications);

// Save publication
routes.post('/publications', PublicationsController.save);

// Charts
routes.get('/charts/list', ChartController.list);

// List all Keywords
routes.get('/keywords', KeywordController.list);

// List keyword countries
routes.get('/keywords/:id/countries', KeywordController.countries);

// Save log
routes.post('/logs', LogController.save);

module.exports = routes;