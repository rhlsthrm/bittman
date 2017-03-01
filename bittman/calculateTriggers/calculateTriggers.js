'use strict';

const rp = require('request-promise');

class CalculateTriggers {
    calculate(stdDev) {
        // url to query Yahoo Finance API for SPX and VIX
        const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22%5ESPX%22%2C%22%5EVIX%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
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
                const spx = parseFloat(quotes.find(quote => quote.symbol === '^SPX').LastTradePriceOnly);
                // low trigger is spx - 1/4 std dev
                const triggerLow = spx - (stdDev / 4);
                // high trigger is spx + 1/4 std dev
                const triggerHigh = spx + (stdDev / 4)
                // low spread is spx - 1/2 std dev
                const spreadLow = spx - (stdDev / 2);
                // high spread is spx + 1/2 std dev
                const spreadHigh = spx + (stdDev / 2)
                fulfill({
                    spxOpen: spx,
                    triggerLow: triggerLow,
                    triggerHigh: triggerHigh,
                    spreadLow: spreadLow,
                    spreadHigh: spreadHigh,
                    stdDev: stdDev
                });
            })
            .catch(reject);
        });
    }
    sendEmail(mailgun, sendAddresses, emailParams) {
        if (!sendAddresses) return;
        const recepients = sendAddresses.join(',');
        const data = {
            from: 'Serverless <serverless@no-reply.com>',
            to: recepients,
            subject: 'Bittman triggers',
            text: `Triggers calculated:
SPX Open: ${emailParams.spxOpen}
SPX Trigger Point Low: ${emailParams.triggerLow}
SPX Trigger Point High: ${emailParams.triggerHigh}
SPX Spread Point Low: ${emailParams.spreadLow}
SPX Spread Point High: ${emailParams.spreadHigh}`
        }
        return mailgun.messages().send(data);
    }
}

module.exports = CalculateTriggers;
