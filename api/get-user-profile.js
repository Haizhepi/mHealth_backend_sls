/**
 * Route: GET /profile/{user_id}
*/

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const _ = require('underscore');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USER_DATA1;

exports.handler = async (event) => {
    try {
        let user_id = decodeURIComponent(event.pathParameters.user_id);

        let params = {
            TableName: tableName,
            // IndexName: "note_id-index",
            KeyConditionExpression: "user_id = :user_id",
            ExpressionAttributeValues: {
                ":user_id": user_id
            },
            Limit: 1
        };

        let data = await dynamodb.query(params).promise();

        if (!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            };
        }
        else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders()
            };
        }

        
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
        }
    }
}