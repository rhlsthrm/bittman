'use strict';

const AWS = require('aws-sdk');
const CalculateVolatility = require('./calculateVolatility');
const $db = new AWS.DynamoDB();
const DynamoDB = require('aws-dynamodb')($db);
const table = process.env.DYNAMODB_TABLE;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const calculateVolatility = new CalculateVolatility();
DynamoDB.client.listTables(function(err, data) {
    console.log(data.TableNames);
});
console.log( DynamoDB.client )
calculateVolatility.calculateStdDev()
    .then(data => {
        console.log(data);
        DynamoDB
            .table(table)
            .return(DynamoDB.ALL_OLD)
	        .insert_or_replace(Object.assign(data, { id: 1 }))
    })
    .catch(console.log)
    .then(console.log);