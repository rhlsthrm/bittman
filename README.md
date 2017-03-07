# bittman

## Background
This project calculates Bittman trading algorithm trading points on Wednesday evenings, and then uses them to calculate the actual triggers based on the morning open price on Thursday.

Background: http://alta5.com/blog/bittman/

This project implements the algorithm using the Serverless framework and sends emails through Mailgun. On Wednesday after market close, the `calculateVolatility` Lambda function runs and stores the data into DynamoDB. On Thursday at market open, the `calculateTriggers` Lambda function runs and sends emails with the trigger points calculated from the market open price.

## Prerequisites
* Serverless (please see https://serverless.com/) for AWS setup instructions.

`$ npm install serverless -g`
* Mailgun account (https://www.mailgun.com/)

## Configuration
The project requires an active [Mailgun](https://www.mailgun.com/) account to send emails. Insert your mailgun API key and domain into the configuration file `common/config.js`. Also you will insert email addresses here.

```
const config = {};
config.mailgun = {
    apiKey: 'key-xxxxxxxxxx',
    domain: 'sandboxxxxxxxxxx.mailgun.org'
};
config.emails = [
    'Rahul <rahul@sethuram.com>'
];
module.exports = config;
```


## Deployment
First, install the npm dependencies:

`$ npm install`

Deploy the functions to AWS:

`$ sls deploy`

The functions have GET endpoints tied to them just so they can be tested, but the functions are meant to be run on the schedule provided.

## Debugging
To debug serverless functions, you can use the following command:

`$ sls logs -f <FUNCTION_NAME> -t`

This will give a tailing log output of the function and provides stack traces of errors.
