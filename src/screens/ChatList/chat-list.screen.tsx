import React, { useEffect } from 'react';
import { FlatList, NavigationSwitchScreenProps } from "react-navigation";
import { ChatRoom } from "@models/chat-room";
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveChats } from '@store/chat-rooms/chat-rooms.actions';
import { AppState } from '@store/index';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import { TouchableNativeFeedback, View, Text } from 'react-native';
import AppMenu from '@components/Menu/menu.component';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import defaultChatAvatar from '@assets/icons/chat.png';
import styles from './styles';
import moment from 'moment-mini';

const ChatListScreen: React.FC<NavigationSwitchScreenProps> & { navigationOptions: any } = (props) => {
  const activeChats: ChatRoom[] | undefined = useSelector((store: AppState) => store.chatRoomsModule.activeChats);
  const dispatch = useDispatch();

  const onOpenChat = (room: ChatRoom) => {
    props.navigation.navigate('Chat', { chatId: room.id });
  };

  const chatRoomTemplate = ({ item }: { item: ChatRoom }) => (
    <TouchableNativeFeedback
      key={item.id!}
      onPress={() => onOpenChat(item)}
    >
      <View style={styles.roomContainer}>
        <CachedImageLoaded
          style={styles.avatar}
          imageUrl={item.avatar}
          defaultImage={defaultChatAvatar}
        />
        <View style={styles.textData}>
          <View style={styles.headLine}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.createDate}>
              {moment(item.lastMessage.createdAt).format('DD MMM HH:mm:ss')}
            </Text>
          </View>

          <Text style={styles.lastMsgContent}>{item.lastMessage.content}</Text> 
        </View>
     
      </View>
    </TouchableNativeFeedback>
  );

  useEffect(() => {
    if (!activeChats) {
      dispatch(fetchActiveChats())
    }
  }, []);

  return activeChats ? (
    <FlatList
      data={activeChats}
      renderItem={chatRoomTemplate}
    />
  ) : <Preloader/>
}

ChatListScreen.navigationOptions = () => ({
  headerRight: () => <AppMenu/>,
});

export default ChatListScreen;