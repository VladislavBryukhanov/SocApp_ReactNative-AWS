class Validation {
  static get mutableUserEntityProperties() {
    return ['nickname', 'bio', 'avatar', 'username'];
  };

  static get validatorErrors() {
    return {
      event: 'Api gateway proxy and auth required',
      body: 'Request body contain unexpected property.'
    };
  }

  static validateBody(body) {
    const bodyValidator = (body) => !(Object.keys(body)).some(
      key => !this.mutableUserEntityProperties.includes(key)
    );

    if (!bodyValidator(body)) {
      throw Error(this.validatorErrors.body);
    }
  }

  static validateEvent(event) {
    if (!event.requestContext) {
      throw Error(this.validatorErrors.event);
    }
  }
}


class UsersDB {
  get queryKeys() {
    const { sub: id, prefered_name: username } = this.userAttributes;
    return { id, username };
  }

  constructor(dynamoDb, tableName, event) {
    Validation.validateEvent(event);
    const userAttributes = event.requestContext.authorizer.claims;

    this.dynamoDb = dynamoDb;
    this.tableName = tableName;
    this.userAttributes = userAttributes;
  }

  async updateDynamodbTable(body) {
    Validation.validateBody(body);

    const AttributeUpdates = (Object.keys(body)).reduce((acc, prop) => ({
      ...acc,
      [prop]: {
        Action: 'PUT',
        Value: body[prop]
      }
    }), {});
    
    return this.dynamoDb.update({
      TableName: this.tableName,
      Key: this.queryKeys,
      AttributeUpdates
    }).promise();
  }

  async fetchUserProfile() {
    const { Item: profile } = await this.dynamoDb.get({ 
      TableName: this.tableName,
      Key: this.queryKeys
    }).promise();

    return profile;
  }
}

module.exports = UsersDB;