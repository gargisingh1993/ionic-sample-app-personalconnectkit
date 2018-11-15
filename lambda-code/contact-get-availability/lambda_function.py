from __future__ import print_function

import boto3
import json
import os
import decimal
import time
from boto3.dynamodb.conditions import Key, Attr

print('Loading function')

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE'])

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

def respond(err, event, res=None):
    print(res)
    if "httpMethod" not in event:
        res.pop('Events',None)
        return res
        
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps({'avail':res},cls=DecimalEncoder),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }

def lambda_handler(event, context):
    print(event)
    
    available = 'True'
    now = int(time.time())
    print(now)

    resp = table.scan(
        FilterExpression =Key('EndTimeStamp').gte(now)
    )

    description = 'NA'

    if resp['Count'] == 0:
        ans = {
            'Available': available,
            'Events': [],
            'Description': description
        }
        return respond(None,event, ans)

    items = resp['Items']
    print(items)
    ans = {
        'Available': available,
        'Events': items,
        'Description': description
    }
    for item in items:
        if item['StartTimeStamp'] <= now:
            ans['Description'] = item['Description']
            ans['Available'] = 'False'
            return respond(None,event, ans)  
    

    
    return respond(None,event, ans)
    