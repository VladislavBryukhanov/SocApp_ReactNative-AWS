userPoolCleaner lambda should be used in cloudWatch every 24h
_____________________

db-utils lambda layer required for that resources:
1) fetchProfile lambda
2) editProfile lambda
3) uploadAvatar lambda

these lambdas requre auth and should be wrapped to API gateway
_____________________

cognito Pre sign-up trigger invokes validateNewUser
cognito Post confirmation trigger invokes validateNewUser createUser
_____________________

soc-app-appSync role should grand acces to chatDb
this role should be used to appSync chat interactions

appsync resolvers kept by path aws/rescources/resolvers they should be updated manually
as well as schema.graphql

_____________________

create new firebase application and bind it's FCM senderID to AWS SNS
create platform application AuNea-chat_v2 using this senderID
after that you should create new topic - Chat-msgs

deviceTokenUpdater and messagesNotifier lambdas require appropriate SNS arns
for platform application and topic

"arn:aws:sns:*:*:Chat-msgs",
"arn:aws:sns:*:*:app/GCM/AuNea-chat_v2"

you need manually add this permission for deviceTokenUpdater
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

and pass such env to lambda:
process.env.SNS_APPLICATION_ARN
process.env.SNS_MSG_TOPIC_ARN

you need manually add this permission for messagesNotifier
{
  "Action": "sns:Publish",
  "Resource": [
    "arn:aws:sns:*:606853744219:Chat-msgs",
    "arn:aws:sns:*:606853744219:app/GCM/AuNea-chat_v2"
  ],
  "Effect": "Allow"
}
and pass such env to lambda:
process.env.SNS_MSG_TOPIC_ARN
