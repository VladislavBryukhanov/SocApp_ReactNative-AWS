import React, { useEffect } from 'react';
import { FlatList } from "react-navigation";
import { ChatRoom } from "@models/chat-room";
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveChats } from '@store/chat-rooms/chat-rooms.actions';
import { AppState } from '@store/index';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import { TouchableNativeFeedback, View, Text } from 'react-native';
import AppMenu from '@components/Menu/menu.component';

const ChatListScreen: React.FC &{ navigationOptions: any }  = () => {
  const activeChats: ChatRoom[] | undefined = useSelector((store: AppState) => store.chatRoomsModule.activeChats);
  const dispatch = useDispatch();

  const chatRoomTemplate = ({ item }: { item: ChatRoom }) => (
    <TouchableNativeFeedback
      key={item.id}
    >
      <View>
        <Text>{item.name}</Text>
      </View>
    </TouchableNativeFeedback>
  )

  useEffect(() => {
    if (!activeChats) {
      dispatch(fetchActiveChats())
    }
  });

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