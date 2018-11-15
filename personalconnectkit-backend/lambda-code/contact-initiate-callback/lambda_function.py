import boto3
import os
import json
import time

connect = boto3.client('connect')

def safe_get(params, key):
    if not key in params:
        return "UNKNOWN"
    else:
        return params[key]

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }


def lambda_handler(event, context):
    print event

    try:
        body = json.loads(event['body'])
        print(body)
        destination_number = body['ContactId']

        contact_flow_id = os.environ['CONTACT_FLOW_ID']
        instance_id = os.environ['INSTANCE_ID']
        source_phone_number  = os.environ['SOURCE_PHONE_NUMBER']

        resp = connect.start_outbound_voice_contact(
            DestinationPhoneNumber = destination_number,
            ContactFlowId = contact_flow_id,
            InstanceId = instance_id,
            SourcePhoneNumber = source_phone_number
        )
        
        
        
        print resp
        
        return respond(None, resp)
    except:
        respond(ValueError('Something went wrong'))