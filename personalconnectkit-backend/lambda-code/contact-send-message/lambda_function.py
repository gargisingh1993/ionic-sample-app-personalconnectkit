import boto3
import os
import time

client = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')

def safe_get(params, key):
    if not key in params:
        return "UNKNOWN"
    else:
        return params[key]

def lambda_handler(event, context):
    print event
    
    cId = event['Details']['Parameters']['ContactId']
    
    cNumber = event['Details']['ContactData']['CustomerEndpoint']['Address']
    
    website = os.environ['S3_URL']
    
    response_string = "{}?id={}".format(website,cId)
    
    message = "Please use the link to leave a message \n\n {}".format(response_string)
    
    
    response = client.publish(
        PhoneNumber=cNumber,
        Message=message,
        MessageStructure='string'
    )
    
    
    
    print response
    
    return {'Successful':'True'}