var express = require('express');
var api = express.Router();
var mod = require('./Api');
/* GET home page. */
api.post('/login', mod.login);
api.post('/country', mod.addCountry);
api.get('/country', mod.getCountries);
api.post('/city', mod.addCity);
api.get('/city', mod.getCities);
api.post('/population', mod.addPopulation);
api.get('/dashboard', mod.dashboard);
api.get('/sort_popluation', mod.sortPopulation);
module.exports = api;
