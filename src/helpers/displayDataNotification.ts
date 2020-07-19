import PushNotification from "react-native-push-notification";
import s3 from '@api/s3/native-s3';
import errorHandler from "@store/errorHandler";

export const displayDataNotification = async ({sender, message, tag}: {[key: string]: string}) => {
    const { avatar, nickname } = JSON.parse(sender);
    const notification = {
        title: nickname,
        bigText: message,
        largeIcon: 'ic_avatar',
        message,
        tag
    // currently @types/react-native-push-notification has wrong types and doesn't contain 'largeIconUrl' property
    } as any;

    if (avatar) {
        try {
            notification.largeIconUrl = await s3.read(avatar);
        } catch (err) {
            errorHandler(err, "displayDataNotification");
        }
    }

    PushNotification.localNotification(notification); 
}