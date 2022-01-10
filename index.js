import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from "react-native-exception-handler";
import appErrorApi from "./app/api/appError";

import App from "./App";

setJSExceptionHandler(async (error, isFatal) => {
  let newErrorMessage = {
    isFatal,
    errorMessage: error.message,
    errorStack: error.stack,
    errorName: error.name,
    nativeError: false,
  };

  const res = await appErrorApi.submitError(newErrorMessage);
  if (res.ok) {
    console.log("Error registered");
  }
  console.log(error.message, isFatal);
}, true);

setNativeExceptionHandler(
  async (exceptionString) => {
    let newErrorMessage = {
      isFatal: false,
      errorMessage: exceptionString,
      errorStack: "",
      errorName: "",
      nativeError: true,
    };
    const res = await appErrorApi.submitError(newErrorMessage);
    if (res.ok) {
      console.log("Native Error registered");
    }
    console.log(exceptionString);
  },
  false,
  true
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
