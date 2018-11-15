'use strict';
var AWS = require("aws-sdk");

exports.handler = function(event, context, callback) {
    
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    
    let ContactId = "null";
    let Response = "noresponse";
    let Message = "No action taken";
    
    
    // This is a simple illustration of app-specific logic to return the response. 
    // Although only 'event.queryStringParameters' are used here, other request data, 
    // such as 'event.headers', 'event.pathParameters', 'event.body', 'event.stageVariables', 
    // and 'event.requestContext' can be used to determine what response to return. 
    //
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && event.httpMethod == 'GET') {
        
        if (event.queryStringParameters.cid !== undefined && 
            event.queryStringParameters.cid !== null && 
            event.queryStringParameters.cid !== "" &&
            event.queryStringParameters.response !== undefined && 
            event.queryStringParameters.response !== null && 
            event.queryStringParameters.response !== "") {
            console.log("Received Contact Id: " + event.queryStringParameters.cid);
            ContactId = event.queryStringParameters.cid;
            Response = event.queryStringParameters.response;
            Message = "Call forward set to " + Response;
        }
    }
    
    if (event.body !== null && event.body !== undefined && event.httpMethod == 'POST') {
        
        let body = JSON.parse(event.body);
        
        if (body.ContactId) 
            ContactId = body.ContactId;
        if(body.Response){
            Response = body.Response;
            Message = "Call forward set to " + Response;
        }
    }

    var responseBody = {
        message: Message
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName : process.env.TABLE,
        Key: {
            "ContactId": ContactId
        },
        UpdateExpression: "set ResponsePermit = :r",
        ExpressionAttributeValues:{
            ":r": Response
        },
        ReturnValues:"UPDATED_NEW"
    };
    var response = {
        statusCode: responseCode,
        headers: {
            "Content-Type": "application/json",
            "Allow-Origin-Access-Control": "*"
        },
        body: JSON.stringify(responseBody)
    };
    console.log(response);
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, response);
        }
    });
    

};