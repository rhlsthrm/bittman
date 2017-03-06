'use strict';

const AWS = require('aws-sdk');
const CalculateTriggers = require('./calculateTriggers');
const Dynamo = require('../common/dynamo');

const table = process.env.DYNAMODB_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const config = require('../common/config');
const Mailgun = require('mailgun-js');

module.exports.calculate = (event, context, callback) => {
    const dynamo = new Dynamo(dynamoDb, table);
    const calculateTriggers = new CalculateTriggers;
    let triggers;
    dynamo.get({ id: 'stdDev' })
    .then(data => {
        return calculateTriggers.calculate(data.stdDev);
    })
    .then(data => {
        triggers = data;
        const mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
        return calculateTriggers.sendEmail(mailgun, config.emails, data);
    })
    .then(data => {
        const item = Object.assign(triggers, { id: 'triggers', createdAt: Date.now() });
        return dynamo.put(item);
    })
    .then(data => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Calculated triggers.' })
        };
        callback(null, response);
    })
    .catch(callback);
};