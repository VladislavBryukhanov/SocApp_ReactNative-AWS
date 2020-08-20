const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
const { errorHandler } = require('./errorHandler.js');

AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const ROOMS_TABLE = process.env.STORAGE_CHATROOMS_NAME;
const MEMBERS_TABLE = process.env.STORAGE_CHATMEMBERS_NAME;

// TODO index const
const MEMBERS_USER_ID_INDEX = 'chatMembers-userId';
const MEMBERS_CHAT_ID_INDEX = 'chatMembers-chatId';

const findDirectByInterlocutor = async (myId, interlocutorId, errHandler) => {
  let interlocutorChatMembership, myChatMembership, chat;

  const fetchMembersByUserId = async (userId) => {
    try {
      return await dynamodb.query({
        TableName: MEMBERS_TABLE,
        IndexName: MEMBERS_USER_ID_INDEX,
        KeyConditionExpression: "userId=:userId",
        ExpressionAttributeValues: {
          ":userId": userId
        },
        ProjectionExpression: 'chatId'
      }).promise();
    } catch (err) {
      return errHandler(500, "Error searching user in ChatMember table", err);
    }
  };

  ([{ Items: interlocutorChatMembership }, { Items: myChatMembership }] = await Promise.all([
    fetchMembersByUserId(interlocutorId),
    fetchMembersByUserId(myId)
  ]));

  const targetRelation = interlocutorChatMembership.reduce((res, item) => {
    return myChatMembership.find(({ chatId }) => chatId === item.chatId);
  }, null);

  if (!targetRelation) {
    return null;
  }

  try {
    ({ Item: chat } = await dynamodb.get({
      TableName: ROOMS_TABLE,
      Key: { id: targetRelation.chatId }
    }).promise());
  } catch (err) {
    return errHandler(500, "Error searching chat by interlocutor's chatId", err);
  }

  return chat;
};

// TODO implement paging
exports.getActiveChats = async (req, res) => {
  const { sub: userId } = req.apiGateway.event.requestContext.authorizer.claims;

  const { Items: chatRelations } = await dynamodb.query({
    TableName: MEMBERS_TABLE,
    IndexName: MEMBERS_USER_ID_INDEX,
    KeyConditionExpression: "userId=:interlocutorId",
    ExpressionAttributeValues: {
      ":interlocutorId": userId
    }
  }).promise();

  const { Responses: { [ROOMS_TABLE] : chatList } }= await dynamodb.batchGet({
    RequestItems: {
      [ROOMS_TABLE]: {
        Keys: chatRelations.map(({ chatId }) => ({
          id: chatId
        }))
      }
    }
  }).promise();

  res.json(chatList);
};

exports.findDirectByInterlocutor = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "findDirectByInterlocutor", code, msg, err);
  const { sub: myId } = req.apiGateway.event.requestContext.authorizer.claims;

  const chat = await findDirectByInterlocutor(myId, req.params.interlocutorId, errHandler);

  if (!chat) {
    return errHandler(404, "No chat found with such id");
  }

  res.status(200).json(chat);
};

exports.getDetailedChat = async (req, res) => {
  try {
    const { Item } = await dynamodb.get({
      TableName: ROOMS_TABLE,
      Key: { id: req.params.roomId }
    }).promise();

    res.json(Item);
  } catch (err) {
    return errorHandler(res, "getDetailedChat", 500, "Error searching chat by interlocutor's chatId", err);
  }
};

exports.createChat = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "createChat", code, msg, err);

  const { interlocurotId, chatName } = req.body;
  const { sub: ownerId } = req.apiGateway.event.requestContext.authorizer.claims;
 
  if (!interlocurotId) {
    return errHandler(400, "InterlocutorId is require parameter");
  }

  const chat = await findDirectByInterlocutor(ownerId, interlocurotId, errHandler);

  if (chat) {
    return errHandler(409, "Such direct already exists");
  }

  const newChatRoomItem = {
    Item: {
      id: uuid(),
      ownerId,
      name: chatName,
    }
  };

  const myMemberItem = {
    Item: {
      id: uuid(),
      userId: ownerId,
      chatId: newChatRoomItem.Item.id,
    }
  };

  const interlocutorMemberItem = {
    Item: {
      id: uuid(),
      userId: interlocurotId,
      chatId: newChatRoomItem.Item.id,
    }
  };

  try {
    await dynamodb.batchWrite({
      RequestItems: {
        [ROOMS_TABLE]: [{
          PutRequest: newChatRoomItem
        }],
        [MEMBERS_TABLE]: [
          {
            PutRequest: myMemberItem
          },
          {
            PutRequest: interlocutorMemberItem
          }
        ]
      }
    }).promise();
  } catch (err) {
    errHandler(500, "Error creating chat or members", err);
  }

  res.status(201).json(newChatRoomItem.Item);
};

exports.deleteChat = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "deleteChat", code, msg, err);
  const { roomId } = req.params;
  let members;

  try {
    ({ Items: members } = await dynamodb.query({
      TableName: MEMBERS_TABLE,
      IndexName: MEMBERS_CHAT_ID_INDEX,
      KeyConditionExpression: "chatId=:chatId",
      ExpressionAttributeValues: {
        ":chatId": roomId
      },
      ProjectionExpression: 'id'
    }).promise());
  } catch (err) {
    errHandler(500, "Error searching members attached to chat by provided id", err)
  }

  if (!members.length) {
    try {
      await dynamodb.delete({
        TableName: ROOMS_TABLE,
        Key: { id: roomId },
      }).promise();
    } catch (err) {
      errHandler(500, "Error deleting chat (without members)", err)
    }

    return res.sendStatus(204);
  }

  try {
    await dynamodb.batchWrite({
      RequestItems: {
        [ROOMS_TABLE]: [{
          DeleteRequest: { Key: { id: roomId} }
        }],
        [MEMBERS_TABLE]: members.map(({ id }) => ({
          DeleteRequest: { Key: { id } }
        }))
      }
    }).promise();
  } catch (err) {
    errHandler(500, "Error deleting chat or members", err)
  }

  res.sendStatus(204);
};
