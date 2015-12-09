'use strict';

var _ = require('lodash');

_.merge(exports, require('./config'));


// Ticker merhods:
exports.ticker = require('./lib/ticker').ticker;


// Trader methods:
var trader = require('./lib/trader');
exports.purchase = trader.purchase;
exports.sell = trader.sell;

exports.balance = require('./lib/common').balance;

// Quick test to ensure modifications are returning a value.
exports.ticker(["USD"], function(err, response){
	console.log("Current Coinbase Price: $" + response.USD.rates.ask);
})