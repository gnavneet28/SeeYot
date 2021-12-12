import { useState, useEffect } from "react";
import { Keyboard } from "react-native";

export default function useKeyboard() {
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboardShown(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboardShown(false));

    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  });

  return keyboardShown;
}
