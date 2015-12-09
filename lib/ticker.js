'use strict';

var Wreck = require('wreck');
var async = require('async');


// copy relevant convienient constants
var config        = require('../config');
var API_ENDPOINT  = config.API_ENDPOINT;


function getTickerUrls(currencies) {
  var urls = [
    API_ENDPOINT + 'buy/'
  ];

  return urls;
}

function formatResponse(currencies, results, callback) {
  var rates = results[0]["data"];
  var usdRate = {
    ask: parseFloat(rates["amount"]),
    bid: parseFloat(rates["amount"])
  };

  var response = {};
  if (currencies.indexOf('USD') !== -1)
    response.USD = {
      currency: 'USD',
      rates: {
        ask: usdRate.ask,
        bid: usdRate.bid
      }
    };

    /* Coinbase returns USD separate from EUR
  if (currencies.indexOf('EUR') !== -1)
    response.EUR = {
      currency: 'EUR',
      rates: {
        ask: parseFloat(usdRate.ask / results[1].sell).toFixed(2),
        bid: parseFloat(usdRate.bid / results[1].sell).toFixed(2)
      }
    };
    */


  if (currencies.length !== Object.keys(response).length)
    return callback(new Error('Unsupported currency'));

  callback(null, response);
}


exports.ticker = function ticker(currencies, callback) {
  if (typeof currencies === 'string')
    currencies = [currencies];

  currencies.sort();

  if(currencies.length === 0)
    return callback(new Error('Currency not specified'));

  var urls = getTickerUrls(currencies);

  // change each url on the list into a download job
  var downloadList = urls.map(function(url) {
    return function(cb) {
      Wreck.get(url, { json:true }, function(err, res, payload) {
        cb(err, payload);
      });
    };
  });

  async.parallel(downloadList, function(err, results) {
    if (err) return callback(err);

    formatResponse(currencies, results, callback);
  });
};

