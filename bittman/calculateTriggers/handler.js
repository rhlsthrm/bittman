'use strict';

const AWS = require('aws-sdk');
const CalculateTriggers = require('./calculateTriggers');
const Dynamo = require('../common/dynamo');

const table = process.env.DYNAMODB_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully updated DynamoDB with trigger values',
                    input: event
                })
            };
            callback(null, response);
        })
        .catch(callback);
};