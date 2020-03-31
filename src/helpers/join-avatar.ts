import s3 from '@api/s3/native-s3';
import { User } from '@models/user';

export const joinAvatar = (user: User) => new Promise((resolve, reject) => {
  if (!user.avatar) {
    return resolve(user);
  }

  s3.read(user.avatar)
    .then((avatar) => resolve({ ...user, avatar}))
    .catch(reject);
});
