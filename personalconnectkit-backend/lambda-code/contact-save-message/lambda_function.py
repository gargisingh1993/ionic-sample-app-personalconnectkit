from __future__ import print_function

import boto3
import json
import os
import decimal
from boto3.dynamodb.conditions import Key
sns = boto3.client('sns')
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
def tryParse(text, source):
    if text in source:
        return source[text]
    else:
        return []        
        
def safe_get(params, key, default="UNKNOWN"):
    if not key in params:
        return default
    else:
        return params[key]

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res,cls=DecimalEncoder),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }
    
def sendsms(message):
    arn = os.environ['TOPIC']
    response = sns.publish(
        PhoneNumber=os.environ['NUMBER'],
        Message=message,
        MessageStructure='string'
    )
    
    response = sns.publish(
        TargetArn=arn,
        Message=json.dumps({'default': message,
                    'sms': message,
                    'email': message
                    
                }),
        Subject='New message',
        MessageStructure='json'
    )

def lambda_handler(event, context):
    
    try:
        
        body = json.loads(event['body'])
        print(body)
        
        
                
        dynamodb = boto3.resource('dynamodb')
        comprehend = boto3.client('comprehend')
        arn = os.environ['TABLE']
        
        table = dynamodb.Table(arn)
        message = safe_get(body, 'Message')
        
        
        
        sentiment = comprehend.detect_sentiment(
                Text=message,
                LanguageCode= 'en'
            )
            
        key_phrases = comprehend.detect_key_phrases(
                Text= message,
                LanguageCode= 'en'
            )
            
        entities = comprehend.detect_entities(
                Text= message,
                LanguageCode= 'en'
            )
        analysis = {}
        analysis['sentiment'] = tryParse("SentimentScore", sentiment)
        analysis['entities'] = tryParse("Entities", entities)
        analysis['key_phrases'] = tryParse("KeyPhrases", key_phrases)
        print(analysis)
        
        if 'ContactId' in body:
            cId = body['ContactId']
            print(cId)
            resp = table.update_item(
                Key = {
                    'ContactId': cId
                },
                UpdateExpression="SET Message = :m, Analysis = :a",
                ExpressionAttributeValues={
                    ':m': message,
                    ':a': json.dumps(analysis),
                }
            )
            print(resp)
            
            sendsms(message)
            
            return respond(None, {'Successful':'True'})
        else:
            
            return respond(None, {'Successful':'False'})
    except:
        return respond(None, {'Successful':'False'})