import React, { useEffect, useRef } from "react";
import useKeyboard from "./useKeyboard";

const useInputFocusRef = () => {
  const textInputRef = useRef();
  const keyboardShown = useKeyboard();

  useEffect(() => {
    if (!keyboardShown) {
      textInputRef.current.blur();
    }
  }, [keyboardShown]);

  return textInputRef;
};

export default useInputFocusRef;
