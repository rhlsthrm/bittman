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

    dynamo.get({ id: 'stdDev' })
    .then(data => {
        return calculateTriggers.calculate(data.stdDev);
    })
    .catch(callback)
    .then(data => {
        const item = Object.assign(data, { id: 'triggers', createdAt: Date.now() });
        return dynamo.put(item);
    })
    .catch(callback)
    .then(data => {
        const mailgun = new Mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
        calculateTriggers.sendEmail(mailgun, config.emails, data);
        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: data })
        };
        callback(null, response);
    })
    .catch(callback);
};