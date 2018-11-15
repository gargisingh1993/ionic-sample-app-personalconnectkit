var AWS = require("aws-sdk");



exports.handler = (event, context, callback) => {
    console.log(event);
    
    
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName : process.env.TABLE,
        Item: {
            "ContactId": event.Details.Parameters.ContactId,
            "ContactInformation": {
                "Company": event.Details.Parameters.Company,
                "ContactStatus": "known",
                "ContactName": event.Details.Parameters.ContactName
            }
        }
    }
    
    console.log(params);
    
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, {"Successful": "False","Error": JSON.stringify(err, null, 2)});
        } else {
            callback(null, {"Successful": "True"});
        }
    });
    
};