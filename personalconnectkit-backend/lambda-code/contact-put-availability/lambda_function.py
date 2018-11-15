import boto3
import os
import time
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE'])

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }

def safe_get(params, key, default="UNKNOWN"):
    if not key in params:
        return default
    else:
        return params[key]

def lambda_handler(event, context):
    print event
    try:
        body = json.loads(event['body'])
        #Build out params
        endTime = int(body['EndTimeStamp'])
        startTime = int(body['StartTimeStamp'])
        description = body['Description']
        
        if 'Delete' in body and body['Delete'] == 'True':
            resp = table.delete_item(
                Key= {
                'EndTimeStamp': endTime,
                'StartTimeStamp':startTime
                }
            )
        else:
            resp = table.put_item(
                Item={
                    'EndTimeStamp': endTime,
                    'StartTimeStamp':startTime,
                    'Description':description
                }
            )
    
        return respond(None, {'Successful':'True'})
    except:
        respond(ValueError('Something went wrong'))

    


    
