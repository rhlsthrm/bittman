'use strict';

const AWS = require('aws-sdk');
const CalculateVolatility = require('./calculateVolatility');
const Dynamo = require('../common/dynamo');

const table = process.env.DYNAMODB_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.calculate = (event, context, callback) => {
    const dynamo = new Dynamo(dynamoDb, table);
    const calculateVolatility = new CalculateVolatility();
    dynamo.delete({ id: 'stdDev' })
        .then(data => {
            return dynamo.delete({ id: 'triggers' });
        })
        .catch(callback)
        .then(data => {
            return calculateVolatility.calculateStdDev();
        })
        .catch(callback)
        .then(data => {
            const insertData = Object.assign(data, { id: 'stdDev', createdAt: Date.now() });
            return dynamo.put(insertData);
        })
        .catch(callback)
        .then(data => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully updated DynamoDB with std dev values',
                    input: event,
                }),
            };
            callback(null, response);
        });
};