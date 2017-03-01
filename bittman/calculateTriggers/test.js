'use strict';
const CalculateTriggers = require('./calculateTriggers');
const calculateTriggers = new CalculateTriggers;
const config = require('../common/config');
const Mailgun = require('mailgun-js');
const mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
calculateTriggers.calculate(45)
.then(data => {
    console.log(data);
    const params = {
        spxOpen: 1728732,
        triggerLow: 1728732,
        triggerHigh: 1728732,
        spreadLow: 1728732,
        spreadHigh: 1728732,
        stdDev: 1728732
    }
    calculateTriggers.sendEmail(mailgun, ['Rahul <rksethuram9@gmail.com>'], params);
})
.then(console.log)
.catch(console.error)