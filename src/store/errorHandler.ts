import { ToastAndroid } from "react-native";

export default (err: Error, moduleName: string) => {
  console.log('Action name: ', moduleName);
  console.log('Error stack: ', err);

  ToastAndroid.show(err.message, ToastAndroid.LONG);
}