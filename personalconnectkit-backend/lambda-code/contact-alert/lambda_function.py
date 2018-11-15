import boto3
import os
import json
import time

client = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE'])

def safe_get(params, key):
    if not key in params:
        return "UNKNOWN"
    else:
        return params[key]

def lambda_handler(event, context):
    print event
    
    cId = event['Details']['Parameters']['ContactId']
    params = event['Details']['ContactData']['Attributes']
    params['ContactId'] = event['Details']['ContactData']['CustomerEndpoint']['Address']
    
    api = os.environ['API_ENDPOINT']
    
    response_string = "Allow: {}?cid={}&response=allow \n Deny: {}?cid={}&response=deny".format(api,cId,api,cId)
    
    message = "{} from {} is calling you from {} \n\n {}".format(safe_get(params, 'ContactName'), safe_get(params,'Company'), safe_get(params, 'ContactId'),response_string)
    arn = os.environ['TOPIC']
    
    resp = table.put_item(
        Item={
            'ContactId': cId,
            'ContactInfo': params,
            'ResponsePermit': 'noresponse',
            'Timestamp': int(time.time())
        }
    )
    
    response = client.publish(
        PhoneNumber=os.environ['NUMBER'],
        Message=message,
        MessageStructure='string'
    )
    
    response = client.publish(
        TargetArn=arn,
        Message=json.dumps({'default': message,
                    'sms': message,
                    'email': message
                    
                }),
        Subject='Incoming call',
        MessageStructure='json'
    )
    
    print response
    
    return {'Successful':'True'}