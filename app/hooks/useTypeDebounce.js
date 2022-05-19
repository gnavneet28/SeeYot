import { useEffect, useState } from "react";

const useTypeDebounce = (value) => {
  const [showTyping, setShowTyping] = useState(false);

  let handler = "";
  useEffect(() => {
    if (!showTyping) {
      setShowTyping(true);
      handler = setTimeout(() => {
        setShowTyping(false);
      }, 2000);
    }

    // return () => {
    //   clearTimeout(handler);
    // };
  }, [value]);

  return showTyping;
};

export default useTypeDebounce;
