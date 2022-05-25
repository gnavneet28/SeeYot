import JailMonkey from "jail-monkey";
import { useState, useEffect } from "react";

const useJailBreak = () => {
  const [jaiBroken, setJailBroken] = useState(false);

  const checkJailBreak = () => {
    if (JailMonkey.isJailBroken()) {
      return setJailBroken(true);
    }

    return setJailBroken(false);
  };

  useEffect(() => {
    checkJailBreak();
  }, []);

  return jaiBroken;
};

export default useJailBreak;
