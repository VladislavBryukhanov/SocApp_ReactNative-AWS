import React, { useState, useEffect } from 'react';
import { graphql } from 'react-apollo'
import { CognitoAuth } from '@api/auth';
import AWSAppSyncClient from "aws-appsync";
import { NavigationSwitchScreenProps, FlatList } from 'react-navigation';
import { Text, View } from 'react-native';
import { Message } from '@models/message';
import styles from './styles';
import listMessagesQuery from '../../api/graphql/queries/listMessages.graphql';
import createMessageMutation from '../../api/graphql/mutations/createMessage.graphql';
import onCreateMessageSubscription from '../../api/graphql/subscriptions/onCreateMessage.graphql';
import { ApolloQueryResult } from 'apollo-client';

interface ChatScreenProps  extends NavigationSwitchScreenProps {};

export const ChatScreen: React.FC<ChatScreenProps> = (props: ChatScreenProps) => {
  const [ messages, setMessages ] = useState(new Array<Message>());

  useEffect(() => {
    const client = new AWSAppSyncClient({
      url: 'https://s3g43sr47vbmpdlgzqejb6xn3m.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      disableOffline: true,
      auth: {
        type: 'AMAZON_COGNITO_USER_POOLS',
        jwtToken: CognitoAuth.retreiveSessionToken().then(token => token || '')
      }
    });

    setInterval(() => client.mutate({ mutation: createMessageMutation,
        variables: {
          "createmessageinput": {
            "chatId": "bkQEBvvDCv7xU9oia1PsWTNHyi6QMVYq",
            "senderId": "vx4mWfNBkvXwbhCZbGiUquqz4EkWdQFa",
            "content": "Hello, world!",
            "timestamp": 1583051052,
            "isRead": false
          }
        }
      }).then(res => console.log('MUT_RES', res))
        .catch(e => console.log('MT_ER', e))
    , 7000);

    client.hydrated().then((client) => {
      console.log('HYD')

      const observable = client.subscribe({ query: onCreateMessageSubscription });
  
      observable.subscribe({
        next: (data) => console.log('>>>>>>>>>>>>>>>>>>>>>>>LIVE', data),
        complete: (ctd) => console.log('>>>>>>>>>>>>>>>>>>>>>>>COM', ctd),
        error: err => console.log('>>>>>>>>>>>>>>>>ERR', err),
      });
    });

    client.query<Message>({ query: listMessagesQuery }).then((
      result: ApolloQueryResult<{ listMessages: { items: Message[]} }>) => 
        setMessages(result.data.listMessages.items)
    );
      
  }, []);

  console.log(messages);

  const messageTemplate = ({ item }: { item: Message }) => (
    <View style={styles.message}>
      {/* <Text>{item.chatId}</Text>
      <Text>{item.senderId}</Text> */}
      <Text style={styles.content}>{item.content}</Text>
      <Text>{item.timestamp}</Text>
    </View>
  )

  return (
    <FlatList
      data={messages}
      renderItem={messageTemplate}
    />
  )
};