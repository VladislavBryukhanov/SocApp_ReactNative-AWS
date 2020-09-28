const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
const { errorHandler } = require('./errorHandler.js');

AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const ROOMS_TABLE = process.env.STORAGE_CHATROOMS_NAME;
const MEMBERS_TABLE = process.env.STORAGE_CHATMEMBERS_NAME;
const USERS_TABLE = process.env.STORAGE_USERLIST_NAME;
const MESSAGES_TABLE = process.env.STORAGE_MESSAGES_NAME;

const MEMBERS_USER_ID_INDEX = 'chatMembers-userId';
const MEMBERS_CHAT_ID_INDEX = 'chatMembers-chatId';
const MESSAGES_CHAT_ID_CREATED_AT_INDEX = 'messages-chatId-createdAt-index';

const findDirectByInterlocutor = async (myId, interlocutorId, errHandler) => {
  let interlocutorChatMembership, myChatMembership;

  const fetchMembersByUserId = userId =>
    dynamodb.query({
      TableName: MEMBERS_TABLE,
      IndexName: MEMBERS_USER_ID_INDEX,
      KeyConditionExpression: "userId=:userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
      ProjectionExpression: "chatId"
    }).promise();
  
  try {
    ([
      { Items: interlocutorChatMembership },
      { Items: myChatMembership }
    ] = await Promise.all([
      fetchMembersByUserId(interlocutorId),
      fetchMembersByUserId(myId)
    ]));
  } catch (err) {
    return errHandler(500, "Error searching users in ChatMember table", err);
  }

  const targetRelation = interlocutorChatMembership.reduce((res, item) => {
    return myChatMembership.find(({ chatId }) => chatId === item.chatId);
  }, null);

  if (!targetRelation) {
    return null;
  }

  try {
    const { Item: chat } = await dynamodb.get({
      TableName: ROOMS_TABLE,
      Key: { id: targetRelation.chatId }
    }).promise();

    return chat;
  } catch (err) {
    return errHandler(500, "Error searching chat by interlocutor's chatId", err);
  }
};

// TODO implement paging
exports.getActiveChats = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "getActiveChats", code, msg, err);
  const { sub: userId } = req.apiGateway.event.requestContext.authorizer.claims;

  let chatIds, chatList;

  // Fetch chats mentioned by authorized user
  try {
    const { Items: chatRelations } = await dynamodb.query({
      TableName: MEMBERS_TABLE,
      IndexName: MEMBERS_USER_ID_INDEX,
      KeyConditionExpression: "userId=:interlocutorId",
      ExpressionAttributeValues: {
        ":interlocutorId": userId
      },
      ProjectionExpression: "chatId"
    }).promise();

    chatIds = chatRelations.map(({ chatId }) => chatId);
  } catch (err) {
    return errHandler(500, "Error fetching members object by personal userId", err);
  }

  try {
    ({ Responses: { 
      [ROOMS_TABLE]: chatList
    }} = await dynamodb.batchGet({
      RequestItems: {
        [ROOMS_TABLE]: {
          Keys: chatIds.map(id => ({ id }))
        }
      }
    }).promise());
  } catch (err) {
    return errHandler(500, "Error fetching chat rooms by personal member objects", err);
  }

  // Fetch last message that wrote in each chat
  const messsagesQueries = chatIds.map(chatId =>
    dynamodb.query({
      TableName: MESSAGES_TABLE,
      IndexName: MESSAGES_CHAT_ID_CREATED_AT_INDEX,
      ScanIndexForward: false,
      Limit: 1,
      KeyConditionExpression: "chatId=:chatId",
      ExpressionAttributeValues: {
        ":chatId": chatId,
      },
    })
    .promise()
    .then(({ Items: [user] }) => user)
  );
  const queryMessagesPromise = Promise.all(messsagesQueries);

  // Find chats without name and set name and avatar of single interlocutor, as such chats are directs
  const chatsWithoutName = chatList.filter(({ name }) => !name);
  const associatedUserIds = chatsWithoutName.map(({ id, membersMetaIds }) => ({ 
    chatId: id,
    interlocutorId: membersMetaIds.find(({ id }) => id !== userId)
  }));

  const usersQueryPromise = dynamodb.batchGet({
    RequestItems: {
      [USERS_TABLE]: {
        Keys: associatedUserIds.map(({ interlocutorId }) => ({ id: interlocutorId }))
      }
    }
  })
  .promise()
  .then(({ Responses }) => Responses[USERS_TABLE]);

  try {
    const [ userList, messages ] = await Promise.all([ usersQueryPromise, queryMessagesPromise ]);

    const resultChatList = associatedUserIds.map(association => {
      const targetChat = chatList.find(({ id }) => id === association.chatId);
      const interlocutor = userList.find(({ id }) => id === association.interlocutorId);
      const lastMessage = messages.find(({ chatId }) => chatId === association.chatId);

      return {
        ...targetChat,
        name: interlocutor.nickname,
        avatar: interlocutor.avatar,
        lastMessage
      }
    });
    
    res.json(resultChatList);
  } catch (err) {
    return errHandler(500, "Error fetching users by memebersMetaIds OR last messages fetching", err);
  }
};

exports.findDirectByInterlocutor = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "findDirectByInterlocutor", code, msg, err);
  const { sub: myId } = req.apiGateway.event.requestContext.authorizer.claims;

  const chat = await findDirectByInterlocutor(myId, req.params.interlocutorId, errHandler);

  if (!chat) {
    return res.sendStatus(204);
  }

  res.status(200).json(chat);
};

exports.getDetailedChat = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "getDetailedChat", code, msg, err);
  const { sub: myId } = req.apiGateway.event.requestContext.authorizer.claims;
  const { roomId } = req.params;

  let chatInfo, members;

  try {
    ({ Item: chatInfo } = await dynamodb.get({
      TableName: ROOMS_TABLE,
      Key: { id: roomId }
    }).promise());
  } catch (err) {
    return errHandler(500, "Error searching chat by interlocutor's chatId", err);
  }

  if (!chatInfo) {
    return errHandler(404, "No chats with such id found");
  }

  try {
    ({ Items: members } = await dynamodb.query({
      TableName: MEMBERS_TABLE,
      IndexName: MEMBERS_CHAT_ID_INDEX,
      KeyConditionExpression: "chatId=:roomId",
      ExpressionAttributeValues: {
        ":roomId": roomId
      },
      ProjectionExpression: 'userId'
    }).promise());
  } catch (err) {
    return errHandler(500, "Error searching members attached to chat by provided id", err);
  }

  try {
    ({ Responses: { [USERS_TABLE]: members } } = await dynamodb.batchGet({
      RequestItems: {
        [USERS_TABLE]: {
          Keys: members.map(({ userId }) => ({ id: userId })),
          ProjectionExpression: 'id, nickname, avatar, username, bio'
        }
      }
    }).promise());
  } catch (err) {
    return errHandler(500, "Error searching users by members id", err);
  }

  const resultChat = {
    id: chatInfo.id,
    name: chatInfo.name,
    avatar: chatInfo.avatar,
    chatOwner: members.find(({ id }) => id === chatInfo.ownerId),
    members
  };

  if (!resultChat.name) {
    const interlocutor = members.find(({ id }) => id !== myId);
    resultChat.name = interlocutor.nickname;
    resultChat.avatar = interlocutor.avatar;
  }

  res.send(resultChat);
};

exports.createChat = async (req, res) => {
  const errHandler = (code, msg, err) => errorHandler(res, "createChat", code, msg, err);

  const { interlocutorId, chatName, avatar } = req.body;
  const { sub: ownerId } = req.apiGateway.event.requestContext.authorizer.claims;
 
  if (!interlocutorId) {
    return errHandler(400, "InterlocutorId is require parameter");
  }

  const chat = await findDirectByInterlocutor(ownerId, interlocutorId, errHandler);

  if (chat) {
    return errHandler(409, "Such direct already exists");
  }

  const newChatRoomItem = {
    Item: {
      id: uuid(),
      ownerId, 
      avatar,
      name: chatName,
      membersMetaIds: [interlocutorId, ownerId],
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
            PutRequest: {
              Item: {
                id: uuid(),
                userId: ownerId,
                chatId: newChatRoomItem.Item.id,
              }
            }          
          },
          {
            PutRequest: {
              Item: {
                id: uuid(),
                userId: interlocutorId,
                chatId: newChatRoomItem.Item.id,
              }
            }
          }
        ]
      }
    }).promise();
  } catch (err) {
    return errHandler(500, "Error creating chat or members", err);
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
    return errHandler(500, "Error searching members attached to chat by provided id", err)
  }

  if (!members.length) {
    try {
      await dynamodb.delete({
        TableName: ROOMS_TABLE,
        Key: { id: roomId },
      }).promise();
    } catch (err) {
      return errHandler(500, "Error deleting chat (without members)", err)
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
    return errHandler(500, "Error deleting chat or members", err);
  }

  res.sendStatus(204);
};
