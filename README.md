<<<<<<< HEAD
# AWS Mobile Ionic Sample App

### Quicklinks
 - [Getting started](#getting-started)
 - [Building and deploying](#building-and-deploying)
 - [Updating your Lambda Function](#updating-your-lambda-function)
 - [Advanced Usage: Using the Sign-up, Login and Sigv4Http services in your application](#advanced-usage-using-the-sign-up-login-and-sigv4http-services-in-your-application)
   - [Making signed requests for Unauthenticated Users (guests)](#making-signed-requests-for-unauthenticated-users-guests)
   - [Adding support for Authenticated Users](#adding-support-for-authenticated-users)


### Architecture Overview

Bootstrap an application built with [Ionic v2](https://ionicframework.com/) on AWS. Ionic is a JavaScript framework that uses [Angular](https://angular.io/) and [Apache Cordova](https://cordova.apache.org/) to run natively on mobile devices. The app will allow users to create, view, update, and delete project tasks. Users will also be able to sign-up and login to gain access to authorized AWS resources. The app will also provide guests access that will allow users which haven't logged-in to view a summary in a task dashboard.

![Application Architecture](./media/arch-diagram.png)

AWS Services used:
* Amazon Cognito User Pools
* Amazon Cognito Federated Identities
* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB
* Amazon S3
* Amazon CloudFront

### Prerequisites

* [AWS Account](https://aws.amazon.com/mobile/details/)
* [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [Ionic CLI](https://ionicframework.com/docs/cli/)

## Getting started

First clone this repo: `git clone https://github.com/gargisingh1993/ionic-sample-app-personalconnectkit`

### Backend setup

1. Set up your AWS resources using AWS Mobile Hub by clicking the button below:

    [![Deploy to AWS Mobile Hub](https://s3.amazonaws.com/deploytomh/button-deploy-aws-mh.png)](https://console.aws.amazon.com/mobilehub/home?#/?config=https://github.com/gargisingh1993/ionic-sample-app-personalconnectkit/blob/master/backend/import_mobilehub/ionic-sample-app.zip)

1. Update the preselected name of your project if necessary and take note of the region in which your resources are created in. Press **Import project**.

### Client setup

![Alt Text](/media/console.gif)

1.  Before proceeding further, in the Mobile Hub console click the **Cloud Logic** tile and import the API that was created for you 'contact-bot-api' and then wait for the API deployment status at the bottom to show **CREATE_COMPLETE** (_this can take a few moments_).

1.  Click **Configure** on the left hand bar of the console and select the **Hosting and Streaming tile**.

1.  At the bottom of the page click **Download aws-config.js file**. Copy this file into the `./ionic-sample-app-personalconnectkit/client/src/assets/` folder of the repo you cloned.

    * Alternatively, click **Resources** on the left hand bar and in the **Amazon S3 Buckets** tile, copy the name of your _hosting_ bucket.

      ![Amazon S3 Buckets](./media/mobilehub-resources-s3-buckets.png)

      Then, using the CLI:

      ```bash
      aws s3api get-object --bucket <YOUR_BUCKET_NAME> --key aws-config.js ./ionic-sample-app-personalconnectkit/client/src/assets/aws-config.js
      ```

1.  Navigate into  `./ionic-sample-app-personalconnectkit/client` and run:

    ```bash
    npm install
    ionic serve
    ```

    Done!

### Application Walkthrough


1.  Open a browser to `http://localhost:8100` to see your running sample app on the **Dashboard** page. All users have access to this page. However, as a guest user, you do not have access to the **Home** page.

    ![Overview of App - 1](./media/app-overview.png)

1.  Click the blue **_User icon_ in the upper right hand corner** to create a new account. Select the **Register** tab, and type in a username, password, and email address.

1.  You should receive a 6-digit verification code in your email inbox. Type this into the screen and click **Confirm**.

1.  Now that you are signed in, you can click the _User icon_ (which is now green) on the Dashboard page to view some information about your account. You can also sign out from this view.

## Building and deploying

The following steps outline how you can build and deploy the application to a hosted webserver with global CDN on AWS (using S3 and CloudFront) created by the Import phase above:

1.  Navigate to `./ionic-sample-app-personalconnectkit/client` and build for production by running:

    ```bash
    npm run build
    ```

2.  Copy everything within the produced `./ionic-sample-app-personalconnectkit/client/www` directory to the S3 bucket that was created earlier. You can do this one of two ways:

    - Via the Mobile Hub console select the **Hosting and Streaming** section of your project, click **Manage Files** at the bottom which will open the S3 console. Click **Upload** and then **Add files** selecting everything inside the `./ionic-sample-app-personalconnectkit/client/www` directory. Press **Upload**.

    - Via the AWS CLI, using the name of the hosting bucket (see [Client Setup](#client-setup) for instructions on how to get the bucket name)

      ```bash
      aws s3 cp --recursive ./ionic-sample-app-personalconnectkit/client/www s3://<YOUR_BUCKET_NAME>
      ```

3. To view your website, in the Mobile Hub console select the **Hosting and Streaming** section and click the **View from S3** to see your page immediately or **View from CloudFront** to see using a CDN (_note: this might be immediate or take up to an hour_).
=======



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
>>>>>>> personalconnectkit-backend

