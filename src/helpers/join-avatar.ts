import s3 from '@api/s3/native-s3';
import { ChatRoom } from '@models/chat-room';
import { User } from '@models/user';

export const joinAvatar = async (item: User | ChatRoom) => {
  if (!item.avatar) {
    return item;
  }

  const avatar = await s3.read(item.avatar);
  return { ...item, avatar };
};
