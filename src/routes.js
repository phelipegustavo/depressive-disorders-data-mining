const express = require('express');
const PopulateController = require('./Controllers/PopulateController');
const CountriesController = require('./Controllers/CountriesController');
const PublicationsController = require('./Controllers/PublicationsController');

const routes = express.Router();

routes.post('/process', PopulateController.process);

routes.post('/countries', CountriesController.save);

routes.get('/publications', PublicationsController.list);
routes.post('/publications', PublicationsController.save);

module.exports = routes;