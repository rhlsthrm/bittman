'use strict';

const AWS = require('aws-sdk');
const CalculateTriggers = require('./calculateTriggers');
const table = process.env.DYNAMODB_TABLE;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.calculate = (event, context, callback) => {
    const calculateTriggers = new CalculateTriggers;
    const params = {
        TableName: table,
        Key: { id: 'stdDev' }
    };
    dynamoDb.get(params, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        const data = result.Item;
        calculateTriggers.calculate(data.stdDev)
            .then(data => {
                const item = Object.assign(data, { id: 'triggers' });
                const params = {
                    TableName: table,
                    Item: item
                };
                dynamoDb.put(params, (err2, result2) => {
                    if (err2) {
                        callback(err2);
                        return;
                    }
                    console.log(data);
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: data,
                            input: event
                        })
                    };
                    callback(null, response);
                });
            })
            .catch(callback);
    });

};