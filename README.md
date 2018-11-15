# Personal Connect Kit

## Summary
Everyone in a customer facing role runs into a particular question: do you provide your personal phone number to customers? With Amazon Connect, you can provide a robust contact solution with custom logic to maintain a high level of accessibility to your customers while preserving your ability to keep a personal number. By using Connect, customers will have the ability to leave messages, request a call back, as well as get connected directly to you without ever needing your direct contact information. 

## Deployment Guide

# Preparation

* Create an S3 bucket
* Upload all project files from this repo into your bucket
* Make note of the S3 URL for contactBot-Backend.template
* Create a second S3 bucket
* Upload the index.html file from the staticweb directory
* Create a static website from the S3 console with the index.html 
>* Go into the new bucket's properties tab
>* Select static web hosting
>* Select Use this bucket to host a website
>* add index.html for the index and error document
>* save
>* select the index.html object and make public
> Capture the URL of this webpage

# Create a Lex Bot
* Go to the Amazon Lex service
* Create the Lex bot
>* Actions -> Import
>* Upload the contactbot-lex.zip file from the lex directory
>* Create
>* Build the Lex bot

# Create the Amazon Connect Instance

* Go to the Amazon Connect service in your AWS console
* Add an instance
>* Select "Store users within Amazon Connect"
>* For the access URL, enter a unique name that you will remember
>* Add Admin information
>* For Telephony Options, make sure both incoming and outbound calls are selected
>* Allow defaults for Data Storage
>* Review and Create
* Wait for the instance to be created
* Claim a phone number and make note of this.* 
* Create the Connect Directly Contact Flow
>* Go to Routing and select Contact Flows
>* Create new Contact Flow
>* On the upper right, you'll see a drop down arrow.  Select Import Flow
>* Select the Connect Directly file in the Contact Flow directory
>* In the Transfer to Phone Number block, replace with your phone number
>* Save and publish
* Using the same process, import the Dynamic Callback flow
>* You may have to select Transfer to Flow and reselect Connect Directly
* In the URL, take note of the two Unique IDs for the instance id and the contact flow id
>* It'll look like https://{contact center name}.awsapps.com/connect/contact-flows/edit?id=arn:{region}:{account number}:instance/{INSTANCE ID}/contact-flow/{CONTACT FLOW ID}
>* Make note of these
* Give your Connect instance access to the Lex bot
>* Go back to the Amazon Connect service page
>* Select your instance
>* Go to Contact flows
>* Under Amazon Lex, add the Lex ContactBot




# Launch the Cloudformation Stack
* Open CloudFormation
* Create new Stack
>* Name the stack something you'll remember
>* CallbackContactFlowId = the contact flow id you noted before
>* ContactInstancePhoneNumber = the number claimed for your contact center.  Use the format +15555555555
>* InstanceId = the ID of the Connect instance id noted before
>* OwnersPhoneNumber = your phone number. Use the format +15555555555
>* S3StaticBucket = the full URL for the index.html page in the static website you created
>* TemplateBucket = The bucket name with all of the project files
>* ZipCodeName = keep as code.zip

# Wait
* Go get a cup of coffee
* Look out the window
* Look up cat memes on the internet

# Update A few things...
* You'll need to get the API URL from API GATEWAY and update it in a few locations
>* In the API_ENDPOINT variable in ContactCheckAlertLambda and ContactAlertLambda
>* In the index.html page for your static web site
* Enter the URL everywhere you see <PUT API URL HERE>

# Connect Amazon Connect to your new Resources
* Open up the Lambda console, you should see a number of new functions created by Cloudformation.  You'll need the arns for these resources.
* Open up the Amazon Connect console. Now you'll need to import the remaining contact flows.  Since certain contact flows have dependencies, you should import them in the following order.  For each lambda function, replace the function name provided with the actual ARN of the function with the same name.
>* Wait for Response
>>* Create new Customer queue flow
>>* Import Wait for Response
>>* Update
>>* Replace ContactCheckAlertLambda with ARN
>>* Replace ContactRequestCallbackLambda with ARN
>>* In Transfer to Phone Number block, replace the endpoint to your phone number and select your new claimed phone number as the Caller ID number 
>>* Save and Publish
>* Wait for Response flow 
>>* Create new Contact flow
>>* Import Wait for Response Flow
>>* You should see warnings saying "Could not resolve ARN, so resolving to resource with the same name".  This is fine.
>>* Save and Publish
>* Request Callback
>>* Create new Contact flow
>>* Import Request Callback
>>* Replace ContactRequestCallbackLambda with ARN
>>* Save and Publish
>* Check Availability
>>* Create new Contact flow
>>* Import Check Availability
>>* Replace ContactGetAvailabilityLambda with ARN
>>* Save and Publish
>* Record a Message
>>* Create new Contact flow
>>* Import Record a message
>>* Replace ContactSendMessageLambda with ARN
>>* Save and Publish
>* General Workflow
>>* New Contact Flow
>>* Import General Workflow
>>* Replace ContactAlertLambda with ARN
>>* Save and Publish
>* Register
>>* Import Register
>>* Replace ContactSaveLambda with ARN
>>* Save and Publish
>* Data Dip
>>* New Contact Flow
>>* Import Data Dip
>>* Replace ContactLookUpLambda with ARN
>>* Save and Publish
* Connect your contact center's phone number to the Data Dip flow
>* Under Routing and Phone Numbers
>* Select the phone number and select Data Dip under Contact flow
* Contact your AWS Rep and ask them to add you to the PFR requesting Cloudformation support for Connect

## Give yourself a call

