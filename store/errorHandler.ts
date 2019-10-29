import { Alert, ToastAndroid } from "react-native";

export default (err: Error) => {
  console.log(err);

  ToastAndroid.show(err.message, ToastAndroid.LONG);
  // Alert.alert(
  //   'Error has occured',
  //   err.message, 
  //   [
  //     { text: 'Ok' }     
  //   ]
  // )
}