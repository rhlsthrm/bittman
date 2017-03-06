'use strict';

const rp = require('request-promise');

class CalculateVolatility {
    /**
     * Calculate standard deviation based on the Bittman algorithm.
     */
    calculateStdDev() {
        // url to query Yahoo Finance API for SPX and VIX
        const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22%5ESPX%22%2C%22%5EVIX%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

        const options = {
            uri: url,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return new Promise((fulfill, reject) => {
            rp(options)
            .then(data => {
                const quotes = data.query.results.quote;
                const vix = parseFloat(quotes.find(quote => quote.symbol === '^VIX').LastTradePriceOnly);
                const spx = parseFloat(quotes.find(quote => quote.symbol === '^SPX').LastTradePriceOnly);
                const stdDev = spx * vix / 100 * Math.sqrt(7 / 252.0);
                fulfill({ stdDev: stdDev, spx: spx, vix: vix });
            })
            .catch(err => {
                reject(err);
            });
        })
    }
}

module.exports = CalculateVolatility;
