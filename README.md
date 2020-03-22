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

