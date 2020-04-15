/**
 * Route: POST /profile
 */

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const moment = require('moment');
const uuidv4 = require('uuid/v4');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USER_DATA1;
// small changes
exports.handler = async (event) => {
    try {
        let item  = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.timestamp = moment().unix();
        
        // for (let [key, value] of Object.entries(item)) {

        // }

        // have to check anything?
        // if (!item.latitude || !item.longitude) {
        //     throw new Error("missing latitude or longitude")
        // }

        let data = await dynamodb.put({
            TableName: tableName,
            Item: item 
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        };
    }
    catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify( {
                error: err.name ? err.name : "exception",
                message: err.message ? err.message : "unknown error"
            })
        };
    }
}