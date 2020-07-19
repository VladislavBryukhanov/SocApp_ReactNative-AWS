import s3 from '@api/s3/native-s3';
import { User } from '@models/user';

export const joinAvatar = async (user: User) => {
  if (!user.avatar) {
    return user;
  }

  const avatar = await s3.read(user.avatar);
  return { ...user, avatar};
};
