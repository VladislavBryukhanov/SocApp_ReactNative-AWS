class Validation {
  static get mutableUserEntityProperties() {
    return ['nickname', 'bio', 'avatar', 'username'];
  };

  static validateRequestBody(body) {
    return !(Object.keys(body)).some(
      key => !this.mutableUserEntityProperties.includes(key)
    );
  }

  static validateRequest(event) {
    const body = JSON.parse(event.body);
    const validators = [
      {
        rule: this.validateRequestBody(body),
        statusCode: 400,
        errorMessage: 'Api gateway proxy and auth required'
      },
      {
        rule: event.requestContext,
        statusCode: 400,
        errorMessage: 'Request body contain unexpected property.'
      }
    ];
  
    validators.forEach((validator) => {
      if (!validator.rule) {
        const { statusCode, errorMessage: message } = validator;
        const body = JSON.stringify({ message });

        throw Error({ statusCode, body });
      }
    });
  }
}


class Database {
  // cognito user 'sub' is unique id of it
  get primaryKeys() {
    return [
      { dynamodbField: 'id', userPoolAttribute: 'sub' },
      { dynamodbField: 'username', userPoolAttribute: 'preferred_username' },
    ];
  }

  constructor(dynamoDb, tableName) {
    this.dynamoDb = dynamoDb;
    this.tableName = tableName;
  }

  async updateDynamodbTable(UserAttributes, body) {
    const Key = {};
    this.primaryKeys.forEach(({ userPoolAttribute, dynamodbField }) => {
      Key[dynamodbField] = UserAttributes[userPoolAttribute];
    });
    
    const AttributeUpdates = (Object.keys(body)).reduce((acc, prop) => ({
      ...acc,
      [prop]: {
        Action: 'PUT',
        Value: body[prop]
      }
    }), {});
    
    return this.dynamoDb.update({
      TableName: this.tableName,
      Key,
      AttributeUpdates
    }).promise();
  }
}

module.exports = async (event, dynamoDb, tableName) => {
  Validation.validateRequest(event);

  const UserAttributes = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body);
  
  const db = new Database(dynamoDb, tableName);
  
  return db.updateDynamodbTable(UserAttributes, body);
}