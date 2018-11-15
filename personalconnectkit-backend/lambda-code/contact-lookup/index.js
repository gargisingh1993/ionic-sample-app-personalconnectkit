var AWS = require("aws-sdk");



exports.handler = (event, context, callback) => {
    console.log(event);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName : process.env.TABLE,
        Key: {
            "ContactId": event.Details.Parameters.CustomerNumber
        }
    };
    
    docClient.get(params, function(err, data){
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, {"ContactStatus": "unknown"});
            
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if("Item" in data){
                callback(null, data.Item.ContactInformation);
            }
            callback(null, {"ContactStatus": "unknown"});
            
        }
    });
   
    
};