import PushNotification from "react-native-push-notification";
import s3 from '@api/s3/native-s3';
import defaultAvatar from '@assets/icons/user.png';

export const displayDataNotification = async ({sender, message, tag}: {[key: string]: string}) => {
    const { avatar, nickname } = JSON.parse(sender);
    const avatarUrl = avatar 
        ? await s3.read(avatar)
        : defaultAvatar;

    PushNotification.localNotification({
        largeIconUrl: avatarUrl,
        title: nickname,
        bigText: message,
        message,
        tag
    // currently @types/react-native-push-notification has wrong types and doesn't contain 'largeIconUrl' property
    } as any); 
}