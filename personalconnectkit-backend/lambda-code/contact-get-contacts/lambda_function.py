from __future__ import print_function

import boto3
import json
import os
import decimal

print('Loading function')

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)
        
        
def safe_get(params, key, default="UNKNOWN"):
    if not key in params:
        return default
    else:
        return params[key]

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps({'call':res},cls=DecimalEncoder),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }

def lambda_handler(event, context):
    
    try:
        body = json.loads(event['body'])
        print(body)
        if 'TABLE' in body:
            target_table = body['TABLE']
        else:
            target_table = 'TABLE_CONTACTS'
        
        
        dynamodb = boto3.resource('dynamodb')
        arn = os.environ[target_table]
        
        table = dynamodb.Table(arn)
    
        if 'ContactId' in body:
            cId = body['ContactId']
            
            resp = table.get_item(
                Key = {
                    'ContactId': cId
                }
            )
            
            item = safe_get(resp,'Item',{})
            return respond(None, item)
        else:
            resp = table.scan()
            item = safe_get(resp,'Items',[])
            return respond(None, item)
    except:
        respond(ValueError('Something went wrong'))