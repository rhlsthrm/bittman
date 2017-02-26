'use strict';

/**
 * Class to "promise-ify" dynamo API
 */
class Dynamo {
    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }
    get(params) {
        const getParams = {
            TableName: this.tableName,
            Key: params
        };
        return new Promise((fulfill, reject) => {
            this.db.get(getParams, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result && result.Item) {
                        fulfill(result.Item);
                    } else {
                        fulfill(undefined);
                    }
                }
            });
        });
    }
    put(params) {
        const item = {
            TableName: this.tableName,
            Item: params
        };
        return new Promise((fulfill, reject) => {
            this.db.put(item, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    fulfill(result);
                }
            });
        });
    }
    delete(params) {
        const deleteParams = {
            TableName: this.tableName,
            Key: params
        };
        return new Promise((fulfill, reject) => {
            this.db.delete(deleteParams, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    fulfill(result);
                }
            });
        });
    }
}

module.exports = Dynamo;
