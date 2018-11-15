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
    params['ContactId'] = event['Details']['ContactData']['CustomerEndpoint']['Address']
    
    #Set working call state
    current_state = "unknown"
    current_time = time.time()
    try:
        resp = table.get_item(
            Key={
                'ContactId': cId
            }
        )
    except ClientError as e:
        #if the get fails, deny the hold
        print e.resp['Error']['Message'] 
        return {"response": "deny" }
    else:
        #if the get succeeds return the state
        item = resp['Item']
        current_state = item['ResponsePermit']
        called_time = int(item['Timestamp'])
        if current_state == "noresponse" and (current_time - called_time) > 500:
            current_state = "deny"

       
    return {"response": current_state }
        


