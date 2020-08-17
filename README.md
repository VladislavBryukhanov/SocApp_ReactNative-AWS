### Amplify environment requirements

All ApiGateway's uses custom auth *cognito-auth* it is cognito token inside Authorization header of each request
such auth must be set maually
_____________________

**userPoolCleaner** lambda should be used in cloudWatch every 24h
_____________________

cognito Pre sign-up trigger invokes **validateNewUser** lambda
cognito Post confirmation trigger invokes **createUser** lambda
_____________________

**messagesNotifier** lambda must listen dynamodb mesages table stream
_____________________

**authRole** (*amplify-soc-app-dev-110127-authRole*)
must has such permission:

**appSync-chat**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "appsync:GraphQL",
            "Resource": (arn:aws:appsync:*:.../types/*/fields/*)
        }
    ]
}
```

**listUsers-labda-invokable**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": (function:listUsers-*ENV*)
        }
    ]
}
```

**medial-resources_s3-readOnly**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": (s3:media-resources-sa*ENV*-*ENV*)
        }
    ]
}
```

they should be set manually
_____________________

*.env.development*
**AMPLIFY_ENV** variable must be equals to amplify environment name
_____________________

Update appropriate dataSource resource dynamodb table of AppSync API

Update *Settings* -> *Default authorization mode* -> *Select a user pool*
according to environment's user pool

_____________________

<!-- TODO replace with amplify implementation -->
**db-utils** lambda layer required for that resources:
1) **fetchProfile** lambda
2) **editProfile** lambda
3) **uploadAvatar** lambda
4) **deviceTokenUpdater** lambda

these lambdas require auth and should be wrapped by API gateway
_____________________

environment variables **SNS_APPLICATION_ARN** and **SNS_MSG_TOPIC_ARN**
must be added to **deviceTokenUpdater** lambda

*these env's expect SNS integration which described below*

### App initialization requirements

soc-app-appSync role should grant access to chatDb and messagedDb
these roles should be used for appSync chat interactions

appsync resolvers kept by path aws/rescources/resolvers they should be updated manually
as well as schema.graphql

role for auth user required to grant access to appsync

```json
{
  "Effect": "Allow",
  "Action": "appsync:GraphQL",
  "Resource": "arn:aws:appsync:*:606853744219:apis/APPSYNC_API_ID/types/*/fields/*"
}
```
_____________________

create new firebase application and bind it's FCM senderID to AWS SNS
create platform application AuNea-chat_v2 using this senderID
after that you should create new topic - Chat-msgs

**deviceTokenUpdater** and **messagesNotifier** lambdas require appropriate SNS arns
for platform application and topic

"arn:aws:sns:*:*:Chat-msgs",
"arn:aws:sns:*:*:app/GCM/AuNea-chat_v2"

you need manually add this permission for **deviceTokenUpdater** lambda

```json
{
  "Action": [
    "sns:DeleteEndpoint",
    "sns:CreatePlatformEndpoint",
    "sns:Unsubscribe",
    "sns:Subscribe"
  ],
  "Resource": [
    "arn:aws:sns:*:*:Chat-msgs",
    "arn:aws:sns:*:*:app/GCM/AuNea-chat_v2"
  ],
  "Effect": "Allow"
}
```

and pass such env to lambda:
process.env.SNS_APPLICATION_ARN
process.env.SNS_MSG_TOPIC_ARN

you need manually add this permission for **messagesNotifier** lambda

```json
{
  "Action": "sns:Publish",
  "Resource": [
    "arn:aws:sns:*:606853744219:Chat-msgs",
    "arn:aws:sns:*:606853744219:app/GCM/AuNea-chat_v2"
  ],
  "Effect": "Allow"
}
```

and pass such env to lambda:
process.env.SNS_MSG_TOPIC_ARN
