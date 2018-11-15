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
        cId = body['ContactId']
        info = body['ContactInformation']
        

        resp = table.put_item(
            Item={
                'ContactId': cId,
                'ContactInformation':info
            }
        )
    
        return respond(None, {'Successful':'True'})
    except:
        respond(ValueError('Something went wrong'))

    


    
