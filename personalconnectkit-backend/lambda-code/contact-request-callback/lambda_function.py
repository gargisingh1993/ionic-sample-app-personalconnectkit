import boto3
import os
import time

client = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE'])

def safe_get(params, key, default="UNKNOWN"):
    if not key in params:
        return default
    else:
        return params[key]

def lambda_handler(event, context):
    print event
    
    #Build out params
    cId = event['Details']['Parameters']['ContactId']
    params = event['Details']['ContactData']['Attributes']
    cId = event['Details']['ContactData']['CustomerEndpoint']['Address']
        

    resp = table.put_item(
        Item={
            'ContactId': cId,
            'CallbackRequestTime': int(time.time()),
            'ContactInfo': params
        }
    )
    
    message = "You have a new callback request from {}".format(safe_get(params, 'ContactName'))
    arn = os.environ['TOPIC']       
        
        
    response = client.publish(
        TopicArn=arn,
        Message=message
    )
    return {'Successful':'True'}

    


    
